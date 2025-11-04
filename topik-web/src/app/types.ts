export type ProblemId = "51" | "52" | "53" | "54";

export type ProblemType =
  | "sentence-completion"
  | "info-description"
  | "opinion-essay";

// ====== 51/52 (빈칸형) ======
export interface SentenceCompletionAnswer {
  answer1: string;
  answer2: string;
}

export interface SentenceCompletionRequest {
  problem_id: "51" | "52";
  question_prompt: string;
  answer: SentenceCompletionAnswer;
}

// ====== 53 (설명글 작성) ======
export interface InfoDescriptionRequest {
  problem_id: "53";
  question_prompt: string;
  answer: string;
  char_count: number;
}

// ====== 54 (에세이 작성) ======
export interface OpinionEssayRequest {
  problem_id: "54";
  question_prompt: string;
  answer: string;
  char_count: number;
}

export type TopikWritingEvaluatorRequest =
  | SentenceCompletionRequest
  | InfoDescriptionRequest
  | OpinionEssayRequest;

// ====== ADK Server Response Types ======
// ADK Server Response Types
export interface AdkEventPart {
  text: string;
}

export interface AdkEventContent {
  parts: AdkEventPart[];
  role: "user" | "model";
}

export interface AdkEvent {
  id: string;
  timestamp: number;
  author: string;
  content: AdkEventContent;
  finishReason: "STOP" | string;
}

export type AdkRunResponse = AdkEvent[];
