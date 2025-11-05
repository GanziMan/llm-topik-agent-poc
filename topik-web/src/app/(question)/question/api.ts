import {
  QuestionId,
  SentenceCompletionAnswer,
  TopikWritingEvaluatorRequest,
} from "@/types/topikWriteType";
import { kyInstance } from "@/lib/ky";
import { QuestionPrompt } from "./mock";

export async function initAdkSession() {
  try {
    await kyInstance.post("/api/topik/session");
  } catch (error) {
    console.error("Failed to initialize ADK session:", error);
  }
}

function formatPayload(
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

export async function fetchEvaluation(
  id: QuestionId,
  answer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string
) {
  const request = formatPayload(id, answer, essayAnswer, context);

  const response = await kyInstance.post("/api/topik", {
    json: request,
  });

  return response.json();
}
