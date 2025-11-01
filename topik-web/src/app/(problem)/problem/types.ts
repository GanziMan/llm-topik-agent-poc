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
  answer_text: SentenceCompletionAnswer;
}

export interface InfoDescriptionRequest {
  problem_id: "53";
  question_prompt: string;
  answer_text: string;
  char_count: number;
}

export interface OpinionEssayRequest {
  problem_id: "54";
  question_prompt: string;
  answer_text: string;
  char_count: number;
}

export type GradeRequest =
  | SentenceCompletionRequest
  | InfoDescriptionRequest
  | OpinionEssayRequest;
