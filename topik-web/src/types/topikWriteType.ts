export type QuestionId = "51" | "52" | "53" | "54";

export type QuestionType =
  | "sentence-completion"
  | "info-description"
  | "opinion-essay";

export interface SentenceCompletionAnswer {
  answer1: string;
  answer2: string;
}

interface BaseRequest {
  questionNumber: QuestionId;
  questionPrompt: string;
}

// ====== 51/52 (빈칸형) ======
export interface SentenceCompletionRequest extends BaseRequest {
  answer: SentenceCompletionAnswer;
}

// ====== 53 (설명글 작성) ======
export interface InfoDescriptionRequest extends BaseRequest {
  answer: string;
  answerCharCount: number;
}

// ====== 54 (에세이 작성) ======
export interface OpinionEssayRequest extends BaseRequest {
  answer: string;
  answerCharCount: number;
}

export type TopikWritingEvaluatorRequest =
  | SentenceCompletionRequest
  | InfoDescriptionRequest
  | OpinionEssayRequest;

// ====== ADK Server Response Types ======
export interface TopikWritingEvaluatorEventPart {
  text: string;
}

export interface TopikWritingEvaluatorEventContent {
  parts: TopikWritingEvaluatorEventPart[];
  role: "model";
}

export interface TopikWritingEvaluatorEvent {
  id: string;
  timestamp: number;
  author: string;
  content: TopikWritingEvaluatorEventContent;
  finishReason: "STOP" | string;
}

export type TopikWritingEvaluatorRunResponse = TopikWritingEvaluatorEvent[];
