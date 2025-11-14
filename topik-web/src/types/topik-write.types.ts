// =================================================================================
// Request Related Types

import { QuestionId } from "./topik.types";

// =================================================================================
export interface SentenceCompletionAnswer<T = string> {
  answer1: T;
  answer2: T;
}

interface BaseRequest {
  questionPrompt: string;
}

// ====== 51/52 (빈칸형) ======
export interface SentenceCompletionRequest extends BaseRequest {
  questionNumber: QuestionId.Q51 | QuestionId.Q52;
  answer: SentenceCompletionAnswer;
}

// ====== 53 (설명글 작성) ======
export interface InfoDescriptionRequest extends BaseRequest {
  questionNumber: QuestionId.Q53;
  answer: string;
  imageUrl?: string; // 53번일땐 이미지 주소가 필요
}

// ====== 54 (에세이 작성) ======
export interface OpinionEssayRequest extends BaseRequest {
  questionNumber: QuestionId.Q54;
  answer: string;
}

export type TopikWritingEvaluatorRequest = SentenceCompletionRequest | InfoDescriptionRequest | OpinionEssayRequest;

// =================================================================================
// Evaluation Response Related Types
// =================================================================================
export type EvaluationResponseById = {
  [QuestionId.Q51]: SentenceCompletionEvaluation;
  [QuestionId.Q52]: SentenceCompletionEvaluation;
  [QuestionId.Q53]: InfoDescriptionEvaluation;
  [QuestionId.Q54]: OpinionEssayEvaluation;
};

export type EvaluationResponseFor<Q extends QuestionId> = EvaluationResponseById[Q];
export type EvaluationResponseUnion = EvaluationResponseById[QuestionId];

interface EvaluationBase {
  total_score: number;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  overall_feedback: string;
}

// 51/52
export interface SentenceCompletionEvaluation extends EvaluationBase {
  scores: SentenceCompletionAnswer<number>;
  model_answer: SentenceCompletionAnswer;
}

// 53
export interface InfoDescriptionEvaluation extends EvaluationBase {
  scores: {
    task_performance: number;
    structure: number;
    language_use: number;
  };
  char_count: number;
  char_count_evaluation: string;
  model_answer: string;
}

// 54
export interface OpinionEssayEvaluation extends EvaluationBase {
  scores: {
    task_performance: number;
    structure: number;
    language_use: number;
  };
  char_count: number;
  char_count_evaluation: string;
  model_answer: string;
}
