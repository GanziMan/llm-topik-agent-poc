import {
  QuestionId,
  SentenceCompletionAnswer,
  TopikWritingEvaluatorRequest,
} from "@/types/write";
import { kyInstance } from "@/lib/ky";
import { QuestionPrompt } from "./mock";

export async function initAdkSession() {
  try {
    await kyInstance.post("/api/topik/session");
  } catch (error) {
    console.error("Failed to initialize ADK session:", error);
    // 세션 초기화 실패는 치명적인 오류는 아닐 수 있으므로,
    // 여기서는 에러를 던지지 않고 콘솔에만 기록합니다.
    // 필요하다면 사용자에게 알림을 표시할 수 있습니다.
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
