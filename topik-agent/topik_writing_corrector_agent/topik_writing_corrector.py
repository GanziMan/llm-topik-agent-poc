import html
import json
import logging
from typing_extensions import override
from google.genai import types
from google.adk.agents import BaseAgent, InvocationContext, LlmAgent

from .prompt import WRITING_CORRECTOR_TEMPLATE

logger = logging.getLogger(__name__)


# TODO: Get from config
TOTAL_SCORE_INFO = {
    "53": {"total": 30},
    "54": {"total": 50},
}


class TopikWritingCorrector(BaseAgent):
    info_description_agent: LlmAgent
    opinion_essay_agent: LlmAgent

    model_config = {"arbitrary_types_allowed": True}

    def __init__(
        self,
        name: str,
        description: str,
        info_description_agent: LlmAgent,
        opinion_essay_agent: LlmAgent,
    ):
        sub_agents_list = [
            info_description_agent,
            opinion_essay_agent,
        ]

        super().__init__(
            name=name,
            description=description,
            info_description_agent=info_description_agent,
            opinion_essay_agent=opinion_essay_agent,
            sub_agents=sub_agents_list,
        )

    @override
    async def _run_async_impl(self, ctx: InvocationContext):
        payload_string = ""
        image_parts: list[types.Part] = []
        if ctx.user_content and ctx.user_content.parts:
            for part in ctx.user_content.parts:
                if getattr(part, "text", None):
                    if not payload_string:
                        payload_string = part.text or ""
                elif getattr(part, "inline_data", None):
                    image_parts.append(part)

        if not payload_string:
            raise ValueError("User input JSON payload is required.")

        try:
            payload_json = json.loads(payload_string)
        except json.JSONDecodeError:
            raise ValueError("Failed to decode user input JSON.")

        question_number = payload_json.get("question_number")
        question_prompt = payload_json.get("question_prompt")
        answer = payload_json.get("answer")
        answer_length = len(answer) if answer else 0
        evaluation_result = payload_json.get("evaluation_result")

        score_guideline = ""
        if evaluation_result and str(question_number) in TOTAL_SCORE_INFO:
            total_score = evaluation_result.get("total_score")
            perfect_score = TOTAL_SCORE_INFO[str(question_number)]["total"]
            if total_score is not None:
                if total_score >= perfect_score:
                    score_guideline = "학생의 답안은 이미 만점이므로 'expected_score_gain'은 '0점' 또는 '변동 없음'으로 설정하고, 점수 향상보다는 표현력 강화나 다른 접근법 제시에 초점을 맞춘 제안을 하세요."
                else:
                    potential_gain = perfect_score - total_score
                    score_guideline = f"학생의 현재 점수는 {total_score}점입니다. 'expected_score_gain' 값은 {potential_gain}점을 초과할 수 없습니다. (53번 만점: 30점, 54번 만점: 50점)"

        # 프롬프트 구성
        main_prompt = WRITING_CORRECTOR_TEMPLATE.format(
            score_guideline=score_guideline)
        if evaluation_result:
            main_prompt += (
                f"\n\n[이전 AI 채점 결과]\n{json.dumps(evaluation_result, indent=2, ensure_ascii=False)}"
            )

        answer_length_prompt = (
            f" \n[글자수]\n{answer_length}"
            if answer_length is not None
            else ""
        )
        standard_prompt = f"{main_prompt}\n\n[문제]\n{html.unescape(question_prompt)}\n\n[학생 답안]\n{answer} \n\n{answer_length_prompt}"

        if question_number == 53 and image_parts:
            ctx.user_content = types.Content(
                parts=[types.Part(text=standard_prompt), *image_parts]
            )
        else:
            ctx.user_content = types.Content(
                parts=[types.Part(text=standard_prompt)])

        routing_map: dict[int, LlmAgent] = {
            53: self.info_description_agent,
            54: self.opinion_essay_agent,
        }
        sub_agent = routing_map.get(question_number)
        if sub_agent is None:
            raise ValueError("Corrector supports only question 53 and 54.")

        final_event = None
        try:
            async for event in sub_agent.run_async(ctx):
                if event.is_final_response():
                    final_event = event
                else:
                    yield event
            if final_event:
                yield final_event
        except Exception as e:
            logger.exception("Corrector sub-agent failed: %s", e)
