from google.adk.agents import LlmAgent

from topik_writer_grader.prompts.common_prompts import ROLE_PROMPT, SYSTEM_PROMPT_TEMPLATE
from topik_writer_grader.prompts.prompt_51_52 import JSON_SCHEMA_51_52, SCORING_GUIDE_51_52, CONTEXT_PROMPT_51_52, FEWSHOT_51_52
from topik_writer_grader.sub_agents.model_config import GENERATE_CONTENT_CONFIG, LLM_MODEL


def _build_instruction() -> str:
    system = SYSTEM_PROMPT_TEMPLATE.format(
        json_schema=JSON_SCHEMA_51_52,
        scoring_guide=SCORING_GUIDE_51_52,
    )
    return f"{ROLE_PROMPT}\n\n{system}\n\n{CONTEXT_PROMPT_51_52}\n\n{FEWSHOT_51_52}"


def create_agent() -> LlmAgent:
    """Creates and configures the agent for grading questions 51 and 52."""
    return LlmAgent(
        name="grader_51_52",
        instruction=_build_instruction(),
        model=LLM_MODEL.GEMINI_25FLASH,
        description="Grades TOPIK questions 51 and 52",
        generate_content_config=GENERATE_CONTENT_CONFIG,
    )


grader_51_52_agent = create_agent()
