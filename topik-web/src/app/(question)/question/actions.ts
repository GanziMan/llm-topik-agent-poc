import {
  QuestionId,
  SentenceCompletionAnswer,
  TopikWritingEvaluatorRequest,
} from "@/types/topikWriteType";
import { kyInstance } from "@/lib/ky";
import { QuestionPrompt } from "./mock";

export async function initTopikWritingEvaluatorSession() {
  try {
    await kyInstance.post("/api/topik-write/session");
  } catch (error) {
    console.error("Failed to zinitialize ADK session:", error);
  }
}

export async function fetchEvaluation(
  id: QuestionId,
  answer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string
) {
  const request = fetchEvaluationRequest(id, answer, essayAnswer, context);

  const response = await kyInstance.post("/api/topik-write/evaluate", {
    json: request,
  });

  return response.json();
}

function fetchEvaluationRequest(
  id: QuestionId,
  answer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string
): TopikWritingEvaluatorRequest {
  if (id === "51" || id === "52") {
    return {
      questionNumber: id,
      questionPrompt: QuestionPrompt(id, context),
      answer: {
        answer1: answer.answer1,
        answer2: answer.answer2,
      },
    };
  }
  return {
    questionNumber: id,
    questionPrompt: QuestionPrompt(id, context),
    answer: essayAnswer,
    answerCharCount: essayAnswer.length,
  };
}
