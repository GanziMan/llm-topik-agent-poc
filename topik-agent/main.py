import logging
from typing import Union
import os
import uvicorn
from dotenv import load_dotenv
from google.adk.agents import BaseAgent
from google.adk.apps.app import App
from google.adk.artifacts.in_memory_artifact_service import InMemoryArtifactService
from google.adk.auth.credential_service.in_memory_credential_service import (
    InMemoryCredentialService,
)
from google.adk.cli.adk_web_server import AdkWebServer
from google.adk.cli.utils.base_agent_loader import BaseAgentLoader
from google.adk.evaluation.in_memory_eval_sets_manager import InMemoryEvalSetsManager
from google.adk.evaluation.local_eval_set_results_manager import (
    LocalEvalSetResultsManager,
)
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.sessions.in_memory_session_service import InMemorySessionService
from topik_writing_evaluator_agent.agent import root_agent as evaluator_root_agent
from topik_writing_corrector_agent.agent import root_agent as corrector_root_agent

# .env 파일 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.INFO)


class TopikAgentsLoader(BaseAgentLoader):
    def load_agent(self, app_name: str) -> Union[BaseAgent, App]:
        if app_name == "topik_writing_evaluator":
            return App(name=app_name, root_agent=evaluator_root_agent)
        if app_name == "topik_writing_corrector":
            return App(name=app_name, root_agent=corrector_root_agent)
        raise ValueError(f"Unknown app: {app_name}")

    def list_agents(self) -> list[str]:
        return ["topik_writing_evaluator", "topik_writing_corrector"]


AGENTS_DIR = os.path.dirname(__file__)


agent_loader = TopikAgentsLoader()
session_service = InMemorySessionService()
artifact_service = InMemoryArtifactService()
credential_service = InMemoryCredentialService()
memory_service = InMemoryMemoryService()
eval_sets_manager = InMemoryEvalSetsManager()
eval_set_results_manager = LocalEvalSetResultsManager(agents_dir=AGENTS_DIR)


# Create the ADK Web Server instance
web_server = AdkWebServer(
    agent_loader=agent_loader,
    session_service=session_service,
    memory_service=memory_service,
    artifact_service=artifact_service,
    credential_service=credential_service,
    eval_sets_manager=eval_sets_manager,
    eval_set_results_manager=eval_set_results_manager,
    agents_dir=AGENTS_DIR,
)


app = web_server.get_fast_api_app(
    allow_origins=["http://localhost:3000"]
)


@app.get("/")
def read_root():
    return {"message": "ADK server is running for topik_writing_evaluator."}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
