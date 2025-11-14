"use client";

import { EvaluationResponseUnion, SentenceCompletionAnswer } from "@/types/topik-write.types";
import QuestionForm from "./QuestionForm";
import SolutionReview from "./SolutionReview";
import { useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import Footer from "@/components/Footer";
import { renderToStaticMarkup } from "react-dom/server";
import { QuestionContents } from "../mock";
import { fetchEvaluation } from "../actions";
import { QuestionId, ErrorResponse } from "@/types/topik.types";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface QuestionLayoutProps {
  id: QuestionId;
}

export default function QuestionLayout({ id }: QuestionLayoutProps) {
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResponseUnion | ErrorResponse | null>(null);
  const [sentenceCompletionAnswer, setSentenceCompletionAnswer] = useState<SentenceCompletionAnswer>({
    answer1: "",
    answer2: "",
  });
  const [essayAnswer, setEssayAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEvaluation = async () => {
    setIsSubmitted(true);
    if (
      (id === QuestionId.Q51 || id === QuestionId.Q52) &&
      (!sentenceCompletionAnswer.answer1 || !sentenceCompletionAnswer.answer2)
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const context = renderToStaticMarkup(QuestionContents[id])
        ?.replace(/<[^>]*>/g, " ")
        ?.replace(/\s+/g, " ")
        .trim();

      switch (id) {
        case QuestionId.Q51:
        case QuestionId.Q52: {
          const res = await fetchEvaluation(id, sentenceCompletionAnswer, "", context, undefined);
          setEvaluationResult(res);
          break;
        }
        case QuestionId.Q53: {
          const res = await fetchEvaluation(
            QuestionId.Q53,
            sentenceCompletionAnswer,
            essayAnswer,
            context,
            "/images/mock/img-53problem.jpeg"
          );
          setEvaluationResult(res);
          break;
        }
        case QuestionId.Q54: {
          const res = await fetchEvaluation(QuestionId.Q54, sentenceCompletionAnswer, essayAnswer, context, undefined);

          setEvaluationResult(res);
          break;
        }
      }
    } catch (e) {
      toast.error("채점 중 오류가 발생했습니다. \n다시 후 다시 시도해주세요.");
      setEvaluationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setEvaluationResult(null);
    setSentenceCompletionAnswer({
      answer1: "",
      answer2: "",
    });
    setEssayAnswer("");
    setIsSubmitted(false);
  };

  const handleSentenceCompletionAnswerChange = (icon: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = icon === "ㄱ" ? "answer1" : "answer2";
    setSentenceCompletionAnswer((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayAnswer(e.target.value);
  };

  return (
    <>
      <div className="flex gap-7.5 justify-center">
        <LoadingOverlay isLoading={isLoading} label="채점 중...">
          <QuestionForm
            id={id}
            sentenceCompletionAnswer={sentenceCompletionAnswer}
            essayAnswer={essayAnswer}
            isLoading={isLoading}
            handleSentenceCompletionAnswerChange={handleSentenceCompletionAnswerChange}
            handleEssayChange={handleEssayChange}
            inputDisabled={!!evaluationResult}
            isSubmitted={isSubmitted}
          />
        </LoadingOverlay>
        {evaluationResult &&
          ("error" in evaluationResult ? (
            <div className="text-red-500">{evaluationResult.error as string}</div>
          ) : (
            <SolutionReview
              questionId={id}
              evaluationResult={evaluationResult}
              essayAnswer={essayAnswer}
              charCount={Array.from(essayAnswer).length}
            />
          ))}
      </div>

      <Footer className="flex gap-2">
        {evaluationResult && (
          <Button onClick={handleRestart} variant="outline" className="px-4 h-12.5">
            다시 연습하기
          </Button>
        )}
        <Button
          onClick={handleEvaluation}
          disabled={isLoading}
          className="px-4 h-12.5 bg-[#737373] text-white rounded-[10px] cursor-pointer"
        >
          {isLoading ? "채점 중..." : "풀이 완료"}
        </Button>
      </Footer>
    </>
  );
}
