export enum LlmMessageRole {
  USER = "user",
  MODEL = "model",
}

export enum QuestionId {
  Q51 = "51",
  Q52 = "52",
  Q53 = "53",
  Q54 = "54",
}

// Agent Communication Related Types
export interface TopikWritingEventPart {
  text: string;
}

export interface TopikWritingEventContent {
  parts: TopikWritingEventPart[];
  role: LlmMessageRole.MODEL;
}

export interface TopikWritingEvent {
  id: string;
  timestamp: number;
  author: string;
  content: TopikWritingEventContent;
  finishReason: "STOP" | string;
}

export type AgentUserMessagePart = { text: string } | { inline_data: { mime_type: string; data: string } };

export type TopikWritingAgentRequest = {
  app_name: string;
  user_id: string;
  session_id: string;
  new_message: {
    parts: Array<AgentUserMessagePart>;
    role: LlmMessageRole.USER;
  };
};

export type TopikWritingAgentResponse = TopikWritingEvent[];

// Error Related Types
export type ErrorResponse = {
  error: string;
  details?: string;
};
