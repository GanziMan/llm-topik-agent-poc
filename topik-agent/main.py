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
from topik_writing_evaluator_agent.agent import root_agent

# Load environment variables from .env file
load_dotenv()

# Configure logging to show INFO level messages
logging.basicConfig(level=logging.INFO)


class PocAgentLoader(BaseAgentLoader):
    def load_agent(self, app_name: str) -> Union[BaseAgent, App]:
        if app_name == "topik_writing_evaluator":
            # The ADK App object wraps the root agent
            return App(name=app_name, root_agent=root_agent)
        raise ValueError(f"Unknown app: {app_name}")

    def list_agents(self) -> list[str]:
        return ["topik_writing_evaluator"]


# Define the directory where agent code is located
AGENTS_DIR = os.path.dirname(__file__)


# Instantiate services with in-memory implementations
agent_loader = PocAgentLoader()
session_service = InMemorySessionService()
memory_service = InMemoryMemoryService()
artifact_service = InMemoryArtifactService()
credential_service = InMemoryCredentialService()
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

# Get the FastAPI app object
app = web_server.get_fast_api_app(
    # Allow CORS for Next.js dev server
    allow_origins=["http://localhost:3000"]
)


# Add a root endpoint for basic health checks
@app.get("/")
def read_root():
    return {"message": "ADK server is running for topik_writing_evaluator."}


# Main entry point to run the server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
