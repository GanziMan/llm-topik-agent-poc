
import html
from typing_extensions import override
from google.genai import types
from google.adk.agents import BaseAgent, InvocationContext, LlmAgent
import logging
import json


logger = logging.getLogger(__name__)


# # BaseAgent를 직접 상속받아 _run_async_impl을 구현함으로써 ‘에이전트가 언제, 무엇을, 어떻게 수행할지’의 전체 제어 흐름을 직접 정의
class TopikWritingEvaluator(BaseAgent):
    sentence_completion_evaluator_agent: LlmAgent
    info_description_evaluator_agent: LlmAgent
    opinion_essay_evaluator_agent: LlmAgent

    # 가장 중요한 설정 - pydantic은 int와 str 같은 기본 자료형만 허용하는데 llm 같은 커스텀 속성도 pydantic이 거부하지 않도록 model_config를 사용하여 커스텀 타입도 설정해준다.
    model_config = {"arbitrary_types_allowed": True, }

    # def __init__ 의미는? -> 생성자 초기화 메서드
    def __init__(
        self, name, description: str,
        sentence_completion_evaluator_agent: LlmAgent,
        info_description_evaluator_agent: LlmAgent,
        opinion_essay_evaluator_agent: LlmAgent,
    ):

        sub_agents_list = [sentence_completion_evaluator_agent,
                           info_description_evaluator_agent, opinion_essay_evaluator_agent]

        # super().__init 하는 이유는? -> 상속받은 클래스의 생성자를 호출하기 위해서
        # super().__init__ 은 상속받은 클래스의 생성자를 호출하기 위해서 사용한다.
        # 즉, 상속받은 클래스의 생성자를 호출하기 위해서 사용한다.
        #
        super().__init__(
            name=name,
            description=description,
            sentence_completion_evaluator_agent=sentence_completion_evaluator_agent,
            info_description_evaluator_agent=info_description_evaluator_agent,
            opinion_essay_evaluator_agent=opinion_essay_evaluator_agent,
            sub_agents=sub_agents_list
        )

    # @override 의미는? -> 상속받은 메서드를 재정의하기 위해서 사용한다.
    @override
    # _run_async_impl 의미는? -> 비동기적으로 LLM(대규모 언어 모델) 호출을 수행하는 함수
    async def _run_async_impl(self, ctx: InvocationContext):

        # Extract plain text from user message
        user_text = ""
        if ctx.user_content and ctx.user_content.parts:
            user_text = "".join(
                part.text or "" for part in ctx.user_content.parts)

        payload = None
        if user_text:
            try:
                # json.loads: JSON 문자열을 Python 객체로 변환
                payload = json.loads(user_text)
            except json.JSONDecodeError:
                raise ValueError("Failed to decode user input JSON.")

        question_number = payload.get("question_number")
        question_prompt = payload.get("question_prompt")
        answer = payload.get("answer")
        char_count = payload.get("char_count")

        # --- Reconstruct content for LLM ---
        char_count_text = f" \n[글자수]\n{char_count}" if char_count is not None else ""
        standardized_input = f"[문제]\n{html.unescape(question_prompt)}\n\n[학생 답안]\n{answer}{char_count_text}"

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
        # try-except 문의 이유는? -> 예외 처리를 위해서
        # target.run_async(ctx) 메서드를 호출하여 비동기적으로 LLM(대규모 언어 모델) 호출을 수행하는 함수
        try:
            async for event in target.run_async(ctx):
                if event.is_final_response():
                    final_event = event
                else:
                    yield event
            if final_event:
                yield final_event
        except Exception as e:
            logger.exception("Sub-agent failed: %s", e)
            # yield types.from_text(f"[오류] {e}")
