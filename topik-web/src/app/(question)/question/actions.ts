import {
  EvaluationResponseFor,
  EvaluationResponseUnion,
  SentenceCompletionAnswer,
  TopikWritingEvaluatorRequest,
} from "@/types/topik-write.types";
import { ApiClient } from "@/lib/ky";
import { QuestionPrompt } from "./mock";
import { QuestionId } from "@/types/topik.types";
import { CorrectionResponse } from "@/types/topik-correct.types";
import { TopikWritingCorrectorRequest } from "@/app/schemas/topik-write.schema";

export async function fetchEvaluation<Q extends QuestionId>(
  id: Q,
  sentenceCompletionAnswer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string,
  imageUrl?: string
): Promise<EvaluationResponseFor<Q>> {
  const request = evaluationRequest(id, sentenceCompletionAnswer, essayAnswer, context, imageUrl);

  const response = await ApiClient.post<TopikWritingEvaluatorRequest, EvaluationResponseFor<Q>>(
    "/api/topik-write/evaluations",
    request
  );
  return response;
}

export async function fetchCorrection(
  id: QuestionId,
  essayAnswer: string,
  context: string,
  evaluationResult: EvaluationResponseUnion,
  imageUrl?: string
): Promise<CorrectionResponse> {
  if (id !== QuestionId.Q53 && id !== QuestionId.Q54) {
    throw new Error("Correction is only available for questions 53 and 54.");
  }

  // evaluationResult has more fields than EvaluationBase, but it's compatible.
  const payload = {
    questionNumber: id,
    questionPrompt: QuestionPrompt(id, context),
    answer: essayAnswer,
    evaluationResult: {
      total_score: evaluationResult.total_score,
      strengths: evaluationResult.strengths,
      weaknesses: evaluationResult.weaknesses,
      improvement_suggestions: evaluationResult.improvement_suggestions,
      overall_feedback: evaluationResult.overall_feedback,
    },
    ...(imageUrl && { imageUrl }),
  };

  const response = await ApiClient.post<TopikWritingCorrectorRequest, CorrectionResponse>(
    "/api/topik-write/corrections",
    payload
  );
  return response;
}

function evaluationRequest(
  id: QuestionId,
  sentenceCompletionAnswer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string,
  imageUrl?: string
): TopikWritingEvaluatorRequest {
  const isSentenceCompletionQuestion = id === QuestionId.Q51 || id === QuestionId.Q52;

  if (isSentenceCompletionQuestion) {
    return {
      questionNumber: id,
      questionPrompt: QuestionPrompt(id, context),
      answer: {
        answer1: sentenceCompletionAnswer["answer1"],
        answer2: sentenceCompletionAnswer["answer2"],
      },
    };
  }
  return {
    questionNumber: id,
    questionPrompt: QuestionPrompt(id, context),
    answer: essayAnswer,
    ...(imageUrl ? { imageUrl } : {}),
  };
}
