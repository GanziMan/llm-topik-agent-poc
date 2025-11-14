export const AGENT_APP_EVALUATOR = process.env.AGENT_APP_EVALUATOR ?? "topik_writing_evaluator";
export const AGENT_APP_CORRECTOR = process.env.AGENT_APP_CORRECTOR ?? "topik_writing_corrector";
export const AGENT_SESSION_URL = (userId: string, sessionId: string, appName: string) =>
  `apps/${appName}/users/${userId}/sessions/${sessionId}`;
