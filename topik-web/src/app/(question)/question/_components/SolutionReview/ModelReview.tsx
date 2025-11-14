import { Card } from "@/components/ui/card";
import {
  EvaluationResponseUnion,
  InfoDescriptionEvaluation,
  OpinionEssayEvaluation,
  SentenceCompletionEvaluation,
} from "@/types/topik-write.types";
import { QuestionId } from "@/types/topik.types";

interface ModelReviewProps {
  questionId: QuestionId;
  evaluationResult: EvaluationResponseUnion;
}

function getModelAnswerContent(questionId: QuestionId, evaluationResult: EvaluationResponseUnion): string {
  switch (questionId) {
    case QuestionId.Q51:
    case QuestionId.Q52: {
      const r = evaluationResult as SentenceCompletionEvaluation;
      return `㉠ ${r.model_answer.answer1} \n ㉡ ${r.model_answer.answer2}`;
    }
    case QuestionId.Q53: {
      const r = evaluationResult as InfoDescriptionEvaluation;
      return r.model_answer;
    }
    case QuestionId.Q54: {
      const r = evaluationResult as OpinionEssayEvaluation;
      return r.model_answer;
    }
    default:
      const _: never = questionId;
      throw new Error(`Invalid questionId: ${_}`);
  }
}

export default function ModelReview({ questionId, evaluationResult }: ModelReviewProps) {
  const content = getModelAnswerContent(questionId, evaluationResult);
  return (
    <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-[513px]">
      <p className="font-semibold">모범 답안</p>
      <p className="whitespace-pre-line">{content}</p>
    </Card>
  );
}
