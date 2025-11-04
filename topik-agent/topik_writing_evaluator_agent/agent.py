from .topik_writing_evaluator import TopikWritingEvaluator
from .evaluators_agents.sentence_completion_agent import sentence_completion_agent
from .evaluators_agents.info_description_agent import info_description_agent
from .evaluators_agents.opinion_essay_agent import opinion_essay_agent


root_agent = TopikWritingEvaluator(
    name="topik_writer_grader_agent",
    description="TOPIK 주관식 문항의 대한 평가 에이전트",
    sentence_completion_agent=sentence_completion_agent,
    info_description_agent=info_description_agent,
    opinion_essay_agent=opinion_essay_agent,
)
