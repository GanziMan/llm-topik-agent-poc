import {
  EvaluationResponseUnion,
  OpinionEssayEvaluation,
  SentenceCompletionEvaluation,
} from "@/types/topik-write.types";
import { QuestionId } from "@/types/topik.types";
import FeedbackCard from "./FeedbackCard";
import ReviewScoreCard from "./ReviewScoreCard";
import { TOTAL_SCORE_INFO } from "@/config/topik-write.config";

const getCharCountEvaluation = (questionId: QuestionId, charCount: number) => {
  if (questionId === QuestionId.Q53) {
    if (charCount < 200) return "분량 미달";
    if (charCount > 300) return "분량 초과";
    return "적정 범위";
  }
  if (questionId === QuestionId.Q54) {
    if (charCount < 600) return "분량 미달";
    if (charCount > 700) return "분량 초과";
    return "적정 범위";
  }
  return "";
};

interface SentenceCompletionViewProps {
  questionId: QuestionId.Q51 | QuestionId.Q52;
  result: SentenceCompletionEvaluation;
}

function SentenceCompletionView({ questionId, result }: SentenceCompletionViewProps) {
  const feedbackItems = [
    { title: "강점", content: result.strengths },
    { title: "약점", content: result.weaknesses },
    { title: "개선 사항", content: result.improvement_suggestions },
  ];
  if (!result) {
    return null;
  }
  return (
    <>
      <ReviewScoreCard title="총점" score={result.total_score} totalScore={TOTAL_SCORE_INFO[questionId].total} />
      <div className="flex gap-5">
        <ReviewScoreCard
          title="ㄱ 빈칸"
          score={result.scores.answer1}
          totalScore={TOTAL_SCORE_INFO[questionId].answer1}
        />
        <ReviewScoreCard
          title="ㄴ 빈칸"
          score={result.scores.answer2}
          totalScore={TOTAL_SCORE_INFO[questionId].answer2}
        />
      </div>
      {feedbackItems.map((item) => (
        <FeedbackCard
          key={item.title}
          title={item.title}
          contents={item.content.length > 0 ? item.content : `${item.title}이 없습니다.`}
        />
      ))}
    </>
  );
}

interface EssayViewProps {
  questionId: QuestionId.Q53 | QuestionId.Q54;
  result: OpinionEssayEvaluation;
  charCount: number;
}

function EssayView({ questionId, result, charCount }: EssayViewProps) {
  const scoreItems = [
    {
      title: "내용 및 과제수행",
      score: result.scores?.task_performance || 0,
      total: TOTAL_SCORE_INFO[questionId].task_performance,
    },
    { title: "글의 전개 구조", score: result.scores?.structure || 0, total: TOTAL_SCORE_INFO[questionId].structure },
    { title: "언어 사용", score: result.scores?.language_use || 0, total: TOTAL_SCORE_INFO[questionId].language_use },
  ];
  const feedbackItems = [
    { title: "강점", content: result.strengths },
    { title: "약점", content: result.weaknesses },
    { title: "개선 사항", content: result.improvement_suggestions },
  ];

  const charCountEvaluation = getCharCountEvaluation(questionId, charCount);

  return (
    <>
      <ReviewScoreCard title="총점" score={result.total_score} totalScore={TOTAL_SCORE_INFO[questionId].total} />
      <ReviewScoreCard
        title="글자수"
        score={charCount}
        totalScore={TOTAL_SCORE_INFO[questionId].char}
        evaluation={charCountEvaluation}
      />
      <div className="flex gap-5">
        {scoreItems.map((item) => (
          <ReviewScoreCard
            key={item.title}
            className="h-full p-5"
            title={item.title}
            score={item.score}
            totalScore={item.total}
          />
        ))}
      </div>
      {feedbackItems.map((item) => (
        <FeedbackCard
          key={item.title}
          title={item.title}
          contents={item.content?.length > 0 ? item.content : `${item.title}이 없습니다.`}
        />
      ))}
    </>
  );
}

interface AIEvaluationReviewProps {
  questionId: QuestionId;
  evaluationResult: EvaluationResponseUnion;
  charCount: number;
}

export default function AIEvaluationReview({ questionId, evaluationResult, charCount }: AIEvaluationReviewProps) {
  if (!evaluationResult) {
    return null;
  }
  switch (questionId) {
    case QuestionId.Q51:
    case QuestionId.Q52:
      return (
        <SentenceCompletionView questionId={questionId} result={evaluationResult as SentenceCompletionEvaluation} />
      );
    case QuestionId.Q53:
    case QuestionId.Q54:
      return (
        <EssayView questionId={questionId} result={evaluationResult as OpinionEssayEvaluation} charCount={charCount} />
      );
    default:
      const _: never = questionId;
      throw new Error(`Invalid questionId: ${_}`);
  }
}
