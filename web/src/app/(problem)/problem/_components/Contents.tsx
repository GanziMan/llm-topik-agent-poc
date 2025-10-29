"use client";

import TextareaWithButton from "../_components/TextareaWithButton";
import InputUpload from "../_components/InputUpload";
import Problem54 from "@/app/_components/Problem/54";
import { useState } from "react";
import Problem51 from "@/app/_components/Problem/51";
import Problem52 from "@/app/_components/Problem/52";
import Problem53 from "@/app/_components/Problem/53";

// 요청 바디 생성기
function makeRequestBody(
  id: ProblemId,
  answer: FillBlankAnswer,
  essayAnswer: string
): GradeRequest {
  if (id === "51" || id === "52") {
    return {
      problem_id: id,
      question: ProblemTitle(id),
      answer: {
        fill_blank_1: answer.fill_blank_1 ?? "",
        fill_blank_2: answer.fill_blank_2 ?? "",
      },
    };
  }

  // 53/54
  return {
    problem_id: id,
    question: ProblemTitle(id),
    answer: essayAnswer,
    char_count: essayAnswer.length,
  };
}

export type ProblemId = "51" | "52" | "53" | "54";
export type ProblemType = "fill-blank" | "essay";

// ====== 51/52 (빈칸형) ======
export interface FillBlankAnswer {
  fill_blank_1: string;
  fill_blank_2: string;
}

export interface GradeRequest_51_52 {
  problem_id: "51" | "52";
  question: string; // UI에 노출한 문항 제목/지문
  answer: FillBlankAnswer; // ㄱ, ㄴ 두 칸
}

export interface GradeResponse_51_52 {
  problem_id: "51" | "52";
  totalScore: number; // 0~10
  breakdown: { fill_blank_1: number; fill_blank_2: number }; // 각 0~5
  feedback: string;
  metrics?: { charCount?: number; sentenceCount?: number }; // 서버 산출 객관값(옵션)
}

export interface GradeRequest_53_54 {
  problem_id: "53" | "54";
  question: string;
  answer: string; // 본문 텍스트
  char_count: number;
  // 서버에서 실제 글자수 계산해 넣을 수도 있음(선택):
  // actual_char_count?: number;
}

export type GradeRequest = GradeRequest_51_52 | GradeRequest_53_54;

export default function Contents({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const [answer, setAnswer] = useState<FillBlankAnswer>({
    fill_blank_1: "",
    fill_blank_2: "",
  });
  const [essayAnswer, setEssayAnswer] = useState<string>("");

  const handleInputChange = (
    icon: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAnswer((prev) => ({
      ...prev,
      [icon === "ㄱ" ? "fill_blank_1" : "fill_blank_2"]: e.target.value,
    }));
  };

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayAnswer(e.target.value);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setResult("");
    try {
      const requestBody = makeRequestBody(
        id as ProblemId,
        answer,
        essayAnswer as string
      );

      const response = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: unknown = await response.json();
      // 안전하게 파싱/표시(선택): 클라에서도 가벼운 형태 검증
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
        <Problem51 />
      ) : id === "52" ? (
        <Problem52 />
      ) : id === "53" ? (
        <Problem53 />
      ) : (
        <Problem54 />
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
            value={answer.fill_blank_1}
            onChange={handleInputChange}
          />
          <InputUpload
            icon="ㄴ"
            value={answer.fill_blank_2}
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

function ProblemTitle(id: string) {
  switch (id) {
    case "54":
      return "다음을 참고하여 600~700자로 글을 쓰시오. 단, 문제를 그대로 옮겨 쓰지마시오. (50점)";
    case "53":
      return "다음을 참고하여 ‘인터넷의 장단점’에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오. (30점)";
    default:
      return "다음 글의 ㄱ과 ㄴ에 알맞은 말을 각각 쓰시오.  (각 10점)";
  }
}
