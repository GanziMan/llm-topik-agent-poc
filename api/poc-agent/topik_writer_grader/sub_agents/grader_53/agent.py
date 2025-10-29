from google.adk.agents import LlmAgent
from topik_writer_grader.prompts.common_prompts import ROLE_PROMPT, SYSTEM_PROMPT_TEMPLATE
from topik_writer_grader.prompts.prompt_53 import JSON_SCHEMA_53, SCORING_GUIDE_53, CONTEXT_PROMPT_53, FEWSHOT_53
from topik_writer_grader.sub_agents.model_config import GENERATE_CONTENT_CONFIG, LLM_MODEL


def _build_instruction() -> str:
    system = SYSTEM_PROMPT_TEMPLATE.format(
        json_schema=JSON_SCHEMA_53,
        scoring_guide=SCORING_GUIDE_53,
    )
    return f"{ROLE_PROMPT}\n\n{system}\n\n{CONTEXT_PROMPT_53}\n\n{FEWSHOT_53}"


def create_agent() -> LlmAgent:
    """Creates and configures the agent for grading question 53."""
    return LlmAgent(
        name="grader_53",
        instruction=_build_instruction(),
        model=LLM_MODEL.GEMINI_25FLASH,
        description="Grades TOPIK question 53",
        generate_content_config=GENERATE_CONTENT_CONFIG

    )


grader_53_agent = create_agent()
