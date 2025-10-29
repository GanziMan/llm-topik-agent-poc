from google.adk.agents import LlmAgent
from topik_writer_grader.prompts.common_prompts import ROLE_PROMPT, SYSTEM_PROMPT_TEMPLATE
from topik_writer_grader.prompts.prompt_54 import JSON_SCHEMA_54, SCORING_GUIDE_54, CONTEXT_PROMPT_54, FEWSHOT_54
from topik_writer_grader.sub_agents.model_config import GENERATE_CONTENT_CONFIG, LLM_MODEL


def _build_instruction() -> str:
    system = SYSTEM_PROMPT_TEMPLATE.format(
        json_schema=JSON_SCHEMA_54,
        scoring_guide=SCORING_GUIDE_54,
    )
    return f"{ROLE_PROMPT}\n\n{system}\n\n{CONTEXT_PROMPT_54}\n\n{FEWSHOT_54}"


def create_agent() -> LlmAgent:
    """Creates and configures the agent for grading question 54."""
    return LlmAgent(
        name="grader_54",
        instruction=_build_instruction(),
        model=LLM_MODEL.GEMINI_25FLASH,
        description="Grades TOPIK question 54",
        generate_content_config=GENERATE_CONTENT_CONFIG
    )


grader_54_agent = create_agent()
