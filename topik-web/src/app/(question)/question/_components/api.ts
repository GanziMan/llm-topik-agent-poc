import {
  QuestionId,
  SentenceCompletionAnswer,
  TopikWritingEvaluatorRequest,
} from "@/app/types";
import { kyInstance } from "@/lib/ky";
import { QuestionPrompt } from "../mock";

function formatPayload(
  id: QuestionId,
  answer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string
): TopikWritingEvaluatorRequest {
  if (id === "51" || id === "52") {
    return {
      problemId: id,
      questionPrompt: QuestionPrompt(id, context),
      answer: {
        answer1: answer.answer1,
        answer2: answer.answer2,
      },
    };
  }
  return {
    problemId: id,
    questionPrompt: QuestionPrompt(id, context),
    answer: essayAnswer,
    charCount: essayAnswer.length,
  };
}

export async function fetchEvaluation(
  id: QuestionId,
  answer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string
) {
  const request = formatPayload(id, answer, essayAnswer, context);

  const response = await kyInstance
    .post("/api/topik", {
      json: request,
    })
    .then((response) => response.json());

  return response;
}
