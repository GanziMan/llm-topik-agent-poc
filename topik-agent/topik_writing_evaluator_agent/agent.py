from .topik_writing_evaluator import TopikWritingEvaluator
from .sub_agents.sentence_completion_evaluator_agent import sentence_completion_evaluator_agent
from .sub_agents.info_description_evaluator_agent import info_description_evaluator_agent
from .sub_agents.opinion_essay_evaluator_agent import opinion_essay_evaluator_agent


root_agent = TopikWritingEvaluator(
    name="topik_writer_grader_agent",
    description="TOPIK 주관식 문항의 대한 평가 에이전트",
    sentence_completion_evaluator_agent=sentence_completion_evaluator_agent,
    info_description_evaluator_agent=info_description_evaluator_agent,
    opinion_essay_evaluator_agent=opinion_essay_evaluator_agent,
)
