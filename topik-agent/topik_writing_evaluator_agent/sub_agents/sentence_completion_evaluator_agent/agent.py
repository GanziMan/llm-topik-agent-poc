from google.adk.agents import LlmAgent
from topik_writing_evaluator_agent.prompt import ROLE_PROMPT, WRITING_EVALUATOR_TEMPLATE
from .prompt import OUTPUT_FORMAT_SCHEMA, SCORING_GUIDE, CONTEXT_PROMPT, FEWSHOT_PROMPT
from topik_writing_evaluator_agent.sub_agents.model_config import GENERATE_CONTENT_CONFIG, LLM_MODEL


WRITING_EVALUATOR_PROMPT = WRITING_EVALUATOR_TEMPLATE.format(
    output_format_schema=OUTPUT_FORMAT_SCHEMA,
    scoring_guide=SCORING_GUIDE,
)
system_prompt = f"""
{ROLE_PROMPT}
{WRITING_EVALUATOR_PROMPT}
{CONTEXT_PROMPT}
{FEWSHOT_PROMPT}
"""


sentence_completion_evaluator_agent = LlmAgent(
    name="sentence_completion_evaluator_agent",
    instruction=system_prompt,
    model=LLM_MODEL.GEMINI_25FLASH,
    description="Sentence Completion Evaluator Agent",
    generate_content_config=GENERATE_CONTENT_CONFIG,
)
