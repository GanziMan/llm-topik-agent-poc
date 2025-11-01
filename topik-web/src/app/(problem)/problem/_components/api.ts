import { GradeRequest, ProblemId, SentenceCompletionAnswer } from "../types";

import ky from "ky";

function formatPayload(
  id: ProblemId,
  answer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string
): GradeRequest {
  if (id === "51" || id === "52") {
    return {
      problem_id: id,
      question_prompt: ProblemTitle(id, context),
      answer_text: {
        answer1: answer.answer1,
        answer2: answer.answer2,
      },
    };
  }

  // 53/54
  return {
    problem_id: id,
    question_prompt: ProblemTitle(id, context),
    answer_text: essayAnswer,
    char_count: essayAnswer.length,
  };
}

export async function fetchEvaluation(
  id: ProblemId,
  answer: SentenceCompletionAnswer,
  essayAnswer: string,
  context: string
): Promise<any> {
  const requestBody = formatPayload(id, answer, essayAnswer, context);
  const response = await ky.post("/api/llm", { json: requestBody }).json();
  return response;
}

export function ProblemTitle(id: string, context: string) {
  switch (id) {
    case "54":
      return `다음을 참고하여 600~700자로 글을 쓰시오. 단, 문제를 그대로 옮겨 쓰지마시오. (50점) \n\n${context}`;
    case "53":
      return `다음을 참고하여 ‘인터넷의 장단점’에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오. (30점) \n\n${context}`;
    default:
      return `다음 글의 ㄱ과 ㄴ에 알맞은 말을 각각 쓰시오. (각 10점) \n\n${context}`;
  }
}
