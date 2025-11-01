"use client";

import TextareaWithButton from "./TextareaWithButton";
import InputUpload from "./InputUpload";
import Problem54 from "@/app/_components/Problem/54";
import { useState } from "react";
import Problem51 from "@/app/_components/Problem/51";
import Problem52 from "@/app/_components/Problem/52";
import Problem53 from "@/app/_components/Problem/53";
import { MockContexts } from "../mock";
import { renderToStaticMarkup } from "react-dom/server";
import { ProblemId, SentenceCompletionAnswer } from "../types";
import { fetchEvaluation } from "./api";

export default function Contents({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const [answer, setAnswer] = useState<SentenceCompletionAnswer>({
    answer1: "",
    answer2: "",
  });

  const [essayAnswer, setEssayAnswer] = useState<string>("");

  const handleInputChange = (
    icon: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const key = icon === "ㄱ" ? "answer1" : "answer2";
    setAnswer((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayAnswer(e.target.value);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setResult("");
    try {
      const context = renderToStaticMarkup(MockContexts[id as ProblemId])
        ?.replace(/<[^>]*>/g, " ") // 태그 제거
        ?.replace(/\s+/g, " ")
        .trim();

      const data = await fetchEvaluation(
        id as ProblemId,
        answer,
        essayAnswer,
        context
      );

      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(
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
      {id === "51" ? (
        <Problem51 context={MockContexts["51"]} />
      ) : id === "52" ? (
        <Problem52 context={MockContexts["52"]} />
      ) : id === "53" ? (
        <Problem53 context={MockContexts["53"]} />
      ) : (
        <Problem54 context={MockContexts["54"]} />
      )}
      {id === "53" || id === "54" ? (
        <TextareaWithButton
          maxLength={id === "53" ? 300 : 700}
          essayAnswer={essayAnswer}
          onChange={handleEssayChange}
        />
      ) : (
        <div className="flex flex-col gap-5">
          <InputUpload
            icon="ㄱ"
            value={answer.answer1}
            onChange={handleInputChange}
          />
          <InputUpload
            icon="ㄴ"
            value={answer.answer2}
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
      {result && !isLoading && (
        <div className="mt-5 p-4 border rounded-md bg-gray-50">
          <p className="font-semibold">채점 결과</p>
          <pre className="whitespace-pre-wrap break-words">{result}</pre>
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
