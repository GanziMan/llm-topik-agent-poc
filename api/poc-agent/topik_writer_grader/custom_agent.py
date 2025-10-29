
from typing_extensions import override
from google.genai import types
from google.adk.agents import Agent, InvocationContext, LlmAgent
import json
import logging
import re

logger = logging.getLogger(__name__)


class TopikWriterGraderAgent(Agent):
    grader_51_52_agent: LlmAgent
    grader_53_agent: LlmAgent
    grader_54_agent: LlmAgent
    input_parsing_agent: LlmAgent

    # 가장 중요한 설정 - pydantic은 int와 str 같은 기본 자료형만 허용하는데 llm 같은 커스텀 속성도 pydantic이 거부하지 않도록 model_config를 사용하여 커스텀 타입도 설정해준다.
    model_config = {"arbitrary_types_allowed": True, }

    def __init__(
        self, name, description: str,
        grader_51_52_agent: LlmAgent,
        grader_53_agent: LlmAgent,
        grader_54_agent: LlmAgent,
        input_parsing_agent: LlmAgent
    ):

        sub_agents_list = [grader_51_52_agent,
                           grader_53_agent, grader_54_agent, input_parsing_agent]
        super().__init__(
            name=name,
            description=description,
            grader_51_52_agent=grader_51_52_agent,
            grader_53_agent=grader_53_agent,
            grader_54_agent=grader_54_agent,
            input_parsing_agent=input_parsing_agent,
            sub_agents=sub_agents_list
        )

    @override
    async def _run_async_impl(self, ctx: InvocationContext):
        # Extract plain text from user message
        user_text = ""
        if ctx.user_content and ctx.user_content.parts:
            user_text = "".join(
                part.text or "" for part in ctx.user_content.parts)

        payload = None
        try:
            # --- Input Parsing: Try JSON first ---
            payload = json.loads(user_text)
            if not isinstance(payload, dict):
                raise ValueError("Input must be a JSON object.")
        except json.JSONDecodeError:
            # --- Fallback to Preprocessor Agent ---
            logger.info("Not a JSON input. Falling back to InputParsingAgent.")

            async for event in self.input_parsing_agent.run_async(ctx):
                if event.is_final_response():
                    parsed_text = "".join(
                        p.text or "" for p in event.content.parts)

                    # LLM이 코드 블록(```json ... ```)을 포함하여 출력하는 경우가 많으므로 정규식으로 순수 JSON만 추출
                    match = re.search(r'\{.*\}', parsed_text, re.DOTALL)
                    if match:
                        try:
                            payload = json.loads(match.group())
                        except json.JSONDecodeError:
                            raise ValueError(
                                "Preprocessor agent returned invalid JSON.")
                    else:
                        raise ValueError(
                            "Could not extract JSON from preprocessor agent's response.")
                    break

            if payload is None:
                raise ValueError(
                    "Input parsing failed to produce a valid output.")

        if "error" in payload:
            raise ValueError(f"Input Error: {payload['error']}")

        question_number = payload.get("question_number")
        question_prompt = payload.get("question_prompt")
        answer_text = payload.get("answer_text")
        char_count = payload.get("char_count")

        logger.info(payload)

        # --- 입력 검증 ---
        if not isinstance(question_number, int) or question_number not in [51, 52, 53, 54]:
            raise ValueError(
                f"Invalid 'question_number': {question_number}. Must be one of 51, 52, 53, 54.")
        if not isinstance(question_prompt, str) or not question_prompt.strip():
            raise ValueError("'question_prompt' must be a non-empty string.")
        if not isinstance(answer_text, str) or not answer_text.strip():
            raise ValueError("'answer_text' must be a non-empty string.")

        # --- Reconstruct content for LLM ---
        char_count_text = f" \n[글자수]\n{char_count}" if char_count is not None else ""
        standardized_input = f"[문제]\n{question_prompt}\n\n[학생 답안]\n{answer_text}{char_count_text}"
        logger.info("Standardized input: %r", standardized_input)
        ctx.user_content = types.Content(
            parts=[types.Part(text=standardized_input)])

        # logger.info("Final standardized input for LLM: %r", standardized_input)

        # Route to a single sub-agent
        if question_number in [51, 52]:
            target = self.grader_51_52_agent
        elif question_number == 53:
            target = self.grader_53_agent
        elif question_number == 54:
            target = self.grader_54_agent
        else:
            raise ValueError(f"Invalid question number: {question_number}")

        # Run sub-agent and post-process final event
        final_event = None
        # 비동기적으로 LLM(대규모 언어 모델) 호출을 수행하는 함수
        async for event in target.run_async(ctx):
            # "이 이벤트가 마지막 응답인지 여부를 반환하는 메서드"
            if event.is_final_response():
                final_event = event
            else:
                yield event  # Yield partial/thought events immediately

        if final_event:
            yield final_event
