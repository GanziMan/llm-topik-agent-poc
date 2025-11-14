"use client";

import { Button } from "@/components/ui/button";
import { EvaluationResponseUnion } from "@/types/topik-write.types";
import { QuestionId } from "@/types/topik.types";
import clsx from "clsx";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import AICorrectionReview from "./AICorrectionReview";
import { fetchCorrection } from "../actions";
import { renderToStaticMarkup } from "react-dom/server";
import { QuestionContents } from "../mock";
import { CorrectionResponse } from "@/types/topik-correct.types";
import AIEvaluationReview from "./SolutionReview/AIEvaluationReview";
import ModelReview from "./SolutionReview/ModelReview";
import toast from "react-hot-toast";
import LoadingOverlay from "@/components/LoadingOverlay";

type ReviewTab = "ai_evaluation" | "ai_correction" | "model";

interface SolutionReviewProps {
  questionId: QuestionId;
  evaluationResult: EvaluationResponseUnion;
  essayAnswer: string;
  charCount: number;
}

const REVIEW_TABS: Array<{ label: string; value: ReviewTab }> = [
  { label: "AI 채점", value: "ai_evaluation" },
  { label: "AI 첨삭", value: "ai_correction" },
  { label: "모범 답안", value: "model" },
];

export default function SolutionReview({ questionId, evaluationResult, essayAnswer, charCount }: SolutionReviewProps) {
  const [reviewType, setReviewType] = useState<ReviewTab>("ai_evaluation");
  const [correctionResult, setCorrectionResult] = useState<CorrectionResponse | null>(null);
  const [isCorrectionLoading, setIsCorrectionLoading] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);

  useEffect(() => {
    if (reviewType !== "ai_correction" || correctionResult) {
      return;
    }

    const getCorrection = async () => {
      if (questionId !== QuestionId.Q53 && questionId !== QuestionId.Q54) {
        return;
      }
      setIsCorrectionLoading(true);
      setCorrectionError(null);
      try {
        const context = renderToStaticMarkup(QuestionContents[questionId])
          ?.replace(/<[^>]*>/g, " ")
          ?.replace(/\s+/g, " ")
          .trim();
        const result = await fetchCorrection(
          questionId,
          essayAnswer,
          context,
          evaluationResult,
          questionId === QuestionId.Q53 ? "/images/mock/img-53problem.jpeg" : undefined
        );
        setCorrectionResult(result);
      } catch (e: any) {
        toast.error("첨삭 중 오류가 발생했습니다. \n다시 후 다시 시도해주세요.");
        setCorrectionError(e.message || "Failed to fetch correction.");
      } finally {
        setIsCorrectionLoading(false);
      }
    };

    getCorrection();
  }, [reviewType, correctionResult, questionId, essayAnswer, evaluationResult]);

  const handleReviewTab = (review: ReviewTab) => {
    setReviewType(review);
  };

  return (
    <LoadingOverlay isLoading={isCorrectionLoading} label="첨삭 중...">
      <SolutionReviewContainer>
        <SolutionReviewActions role="tablist">
          {REVIEW_TABS.map((tab) => (
            <ReviewActionButton
              key={tab.value}
              label={tab.label}
              isActive={reviewType === tab.value}
              onClick={() => handleReviewTab(tab.value)}
            />
          ))}
        </SolutionReviewActions>
        {reviewType === "ai_evaluation" && (
          <AIEvaluationReview questionId={questionId} evaluationResult={evaluationResult} charCount={charCount} />
        )}
        {reviewType === "ai_correction" && correctionResult && (
          <AICorrectionReview
            questionId={questionId}
            correctionResult={correctionResult}
            isLoading={isCorrectionLoading}
            error={correctionError}
            initialScore={evaluationResult.total_score}
          />
        )}
        {reviewType === "model" && <ModelReview questionId={questionId} evaluationResult={evaluationResult} />}
      </SolutionReviewContainer>
    </LoadingOverlay>
  );
}

interface ReviewActionButtonProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}
function ReviewActionButton({ isActive, label, onClick }: ReviewActionButtonProps) {
  return (
    <Button
      role="tab"
      aria-selected={isActive}
      type="button"
      className={clsx(
        "rounded-[20px] p-2.5 h-12.5 leading-[30px] bg-white text-black",
        isActive && "bg-[#737373] text-white"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

const SolutionReviewContainer = tw.div`p-5 flex flex-col gap-[30px] bg-white w-[553px]`;
const SolutionReviewActions = tw.div`flex gap-4.5`;
