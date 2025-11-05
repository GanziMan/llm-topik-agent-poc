
import html
from typing_extensions import override
from google.genai import types
from google.adk.agents import BaseAgent, InvocationContext, LlmAgent
import logging
import json

logger = logging.getLogger(__name__)


class TopikWritingEvaluator(BaseAgent):
    sentence_completion_agent: LlmAgent
    info_description_agent: LlmAgent
    opinion_essay_agent: LlmAgent

    model_config = {"arbitrary_types_allowed": True, }

    def __init__(
        self, name, description: str,
        sentence_completion_agent: LlmAgent,
        info_description_agent: LlmAgent,
        opinion_essay_agent: LlmAgent,
    ):

        sub_agents_list = [sentence_completion_agent,
                           info_description_agent, opinion_essay_agent]

        super().__init__(
            name=name,
            description=description,
            sentence_completion_agent=sentence_completion_agent,
            info_description_agent=info_description_agent,
            opinion_essay_agent=opinion_essay_agent,
            sub_agents=sub_agents_list
        )

    @override
    async def _run_async_impl(self, ctx: InvocationContext):

        if ctx.user_content and ctx.user_content.parts:
            payload_string = "".join(
                part.text or "" for part in ctx.user_content.parts)

        if payload_string:
            try:
                payload_json = json.loads(payload_string)
            except json.JSONDecodeError:
                raise ValueError("Failed to decode user input JSON.")

        question_number = payload_json.get("question_number")
        question_prompt = payload_json.get("question_prompt")
        answer = payload_json.get("answer")
        answer_char_count = payload_json.get("answerCharCount")

        char_count_note = f" \n[글자수]\n{answer_char_count}" if answer_char_count is not None else ""
        standard_prompt = f"[문제]\n{html.unescape(question_prompt)}\n\n[학생 답안]\n{answer}{char_count_note}"

        ctx.user_content = types.Content(
            parts=[types.Part(text=standard_prompt)])

        if question_number in [51, 52]:
            sub_agent = self.sentence_completion_agent
        elif question_number == 53:
            sub_agent = self.info_description_agent
        elif question_number == 54:
            sub_agent = self.opinion_essay_agent
        else:
            raise ValueError(f"Invalid question number: {question_number}")

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
            logger.exception("Sub-agent failed: %s", e)
