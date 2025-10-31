
from typing_extensions import override
from google.genai import types
from google.adk.agents import Agent, InvocationContext, LlmAgent
import logging


logger = logging.getLogger(__name__)


class TopikWritingEvaluator(Agent):
    sentence_completion_evaluator_agent: LlmAgent
    info_description_evaluator_agent: LlmAgent
    opinion_essay_evaluator_agent: LlmAgent

    # 가장 중요한 설정 - pydantic은 int와 str 같은 기본 자료형만 허용하는데 llm 같은 커스텀 속성도 pydantic이 거부하지 않도록 model_config를 사용하여 커스텀 타입도 설정해준다.
    model_config = {"arbitrary_types_allowed": True, }

    def __init__(
        self, name, description: str,
        sentence_completion_evaluator_agent: LlmAgent,
        info_description_evaluator_agent: LlmAgent,
        opinion_essay_evaluator_agent: LlmAgent,
    ):

        sub_agents_list = [sentence_completion_evaluator_agent,
                           info_description_evaluator_agent, opinion_essay_evaluator_agent]
        super().__init__(
            name=name,
            description=description,
            sentence_completion_evaluator_agent=sentence_completion_evaluator_agent,
            info_description_evaluator_agent=info_description_evaluator_agent,
            opinion_essay_evaluator_agent=opinion_essay_evaluator_agent,
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

        question_number = payload.get("question_number")
        question_prompt = payload.get("question_prompt")
        answer_text = payload.get("answer_text")
        char_count = payload.get("char_count")

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
        standardized_input = f"[문제]\n{question_prompt.replace('&quot;', '')}\n\n[학생 답안]\n{answer_text}{char_count_text}"

        logger.info("Standardized input: %r", standardized_input)
        ctx.user_content = types.Content(
            parts=[types.Part(text=standardized_input)])

        # logger.info("Final standardized input for LLM: %r", standardized_input)

        # Route to a single sub-agent
        if question_number in [51, 52]:
            target = self.sentence_completion_evaluator_agent
        elif question_number == 53:
            target = self.info_description_evaluator_agent
        elif question_number == 54:
            target = self.opinion_essay_evaluator_agent
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
