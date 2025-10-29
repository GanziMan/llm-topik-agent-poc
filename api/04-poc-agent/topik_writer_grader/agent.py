from .custom_agent import TopikWriterGraderAgent
from .sub_agents.grader_51_52 import grader_51_52_agent
from .sub_agents.grader_53 import grader_53_agent
from .sub_agents.grader_54 import grader_54_agent
from .preprocessor.agent import input_parsing_agent


root_agent = TopikWriterGraderAgent(
    name="topik_writer_grader_agent",
    description="TOPIK questions 51 and 52, 53, 54",
    grader_51_52_agent=grader_51_52_agent,
    grader_53_agent=grader_53_agent,
    grader_54_agent=grader_54_agent,
    input_parsing_agent=input_parsing_agent,
)
