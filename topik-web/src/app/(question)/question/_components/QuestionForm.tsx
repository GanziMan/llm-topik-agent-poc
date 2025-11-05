"use client";

import TextareaWithButton from "./TextareaWithButton";
import AnswerUploadField from "./AnswerUploadField";
import { useEffect, useState } from "react";
import { MockContexts } from "../mock";
import { renderToStaticMarkup } from "react-dom/server";

import { QuestionId, SentenceCompletionAnswer } from "@/types/topikWriteType";
import { initAdkSession, fetchEvaluation } from "../actions";

export default function QuestionForm({ id }: { id: QuestionId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState("");

  const [sentenceCompletionAnswer, setSentenceCompletionAnswer] =
    useState<SentenceCompletionAnswer>({
      answer1: "",
      answer2: "",
    });

  const [essayAnswer, setEssayAnswer] = useState<string>("");

  const handleInputChange = (
    icon: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const key = icon === "ㄱ" ? "answer1" : "answer2";
    setSentenceCompletionAnswer((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayAnswer(e.target.value);
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 ADK 세션을 초기화
    initAdkSession();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setEvaluationResult("");
    try {
      const context = renderToStaticMarkup(MockContexts[id])
        ?.replace(/<[^>]*>/g, " ")
        ?.replace(/\s+/g, " ")
        .trim();

      const fetchEvaluationResponse = await fetchEvaluation(
        id,
        sentenceCompletionAnswer,
        essayAnswer,
        context
      );

      setEvaluationResult(JSON.stringify(fetchEvaluationResponse));
    } catch (e) {
      setEvaluationResult(
        e instanceof Error
          ? `오류가 발생했습니다: ${e.message}`
          : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Question context={MockContexts[id]} />

      {id === "53" || id === "54" ? (
        <TextareaWithButton
          maxLength={id === "53" ? 300 : 700}
          essayAnswer={essayAnswer}
          onChange={handleEssayChange}
        />
      ) : (
        <div className="flex flex-col gap-5">
          <AnswerUploadField
            icon="ㄱ"
            value={sentenceCompletionAnswer.answer1}
            onChange={handleInputChange}
          />
          <AnswerUploadField
            icon="ㄴ"
            value={sentenceCompletionAnswer.answer2}
            onChange={handleInputChange}
          />
          {/* 51, 52번용 제출 버튼이 필요하면 여기에 추가 */}
        </div>
      )}

      {isLoading && (
        <div className="mt-5 p-4 border rounded-md bg-gray-50">
          <p className="font-semibold">채점 결과</p>
          <p>채점 결과를 기다리는 중입니다...</p>
        </div>
      )}
      {evaluationResult && !isLoading && (
        <div className="mt-5 p-4 border rounded-md bg-gray-50">
          <p className="font-semibold">채점 결과</p>
          <pre className="whitespace-pre-wrap wrap-break-words">
            {evaluationResult}
          </pre>
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-20 h-[50px] bg-[#737373] text-white rounded-[10px] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "채점 중..." : "제출"}
      </button>
    </>
  );
}

function Question({ context }: { context: React.ReactNode }) {
  return <div className="flex flex-col border border-[#B4B4B4]">{context}</div>;
}
