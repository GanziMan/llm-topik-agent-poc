from google.adk.agents import LlmAgent
from .prompts import build_prompt
from ..sub_agents.model_config import GENERATE_CONTENT_CONFIG, LLM_MODEL


def create_agent() -> LlmAgent:
    """Creates an agent that parses free-form text to extract structured data."""
    return LlmAgent(
        name="input_parser",
        instruction=build_prompt(),
        model=LLM_MODEL.GEMINI_25FLASH,
        description="Parses user's free-form text to find question number, prompt, and answer.",
        generate_content_config=GENERATE_CONTENT_CONFIG,
    )


input_parsing_agent = create_agent()
