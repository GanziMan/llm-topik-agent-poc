"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import clsx from "clsx";
import { useState } from "react";
import tw from "tailwind-styled-components";

export default function SolutionReview() {
  const [solutionReview, setSolutionReview] = useState<
    "ai" | "model" | "lecture"
  >("ai");

  const handleSolutionReview = (review: "ai" | "model" | "lecture") => {
    setSolutionReview(review);
  };

  return (
    <div className="p-5 flex flex-col gap-[30px] bg-white">
      <SolutionReviewActions>
        <SolutionReviewActionButton
          label="AI 채점"
          isTextActive={solutionReview === "ai"}
          onClick={() => handleSolutionReview("ai")}
        />
        <SolutionReviewActionButton
          label="모범 답안"
          isTextActive={solutionReview === "model"}
          onClick={() => handleSolutionReview("model")}
        />
        <SolutionReviewActionButton
          label="관련 강의"
          isTextActive={solutionReview === "lecture"}
          onClick={() => handleSolutionReview("lecture")}
        />
      </SolutionReviewActions>
      {solutionReview === "ai" && <AISolutionReview />}
      {solutionReview === "model" && <ModelSolutionReview />}
      {/* TODO: 관련 강의 추가 */}
      {/* {solutionReview === "lecture" && <LectureSolutionReview />} */}
    </div>
  );
}

const SolutionReviewActions = tw.div`flex gap-4.5`;

function SolutionReviewActionButton({
  isTextActive,
  label,
  onClick,
}: {
  label: string;
  isTextActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      className={clsx(
        "rounded-[20px] p-2.5 h-12.5 leading-[30px] bg-white text-black",
        isTextActive && "bg-[#737373] text-white"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function SolutionReviewScoreCard({
  label,
  score,
  totalScore,
}: {
  label: string;
  score: number;
  totalScore: number;
}) {
  return (
    <Card className="px-6 py-4 flex flex-col gap-[14px] w-full h-[110px]">
      <p className="font-semibold text-[#637381] text-sm">{label}</p>
      <p className="flex gap-[10px] text-2xl leading-7 text-[#999] font-bold">
        <span className="text-[#030712]">{score}</span>
        <span>/</span>
        <span>{totalScore}</span>
      </p>
    </Card>
  );
}

function AISolutionReview() {
  return (
    <>
      <div className="flex flex-col justify-between gap-[19px]">
        <SolutionReviewScoreCard label="총점" score={10} totalScore={10} />
        <div className="flex gap-5">
          <SolutionReviewScoreCard label="ㄴ 빈칸" score={5} totalScore={5} />
          <SolutionReviewScoreCard label="ㄱ 빈칸" score={5} totalScore={5} />
        </div>
      </div>

      <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-[513px]">
        <p className="font-semibold">강점</p>
        <ul className="list-disc list-inside ps-2">
          <li>
            제시된 자료의 모든 정보(과거-현재 변화, 원인, 전망)를 빠짐없이
            정확하게 포함했습니다.
          </li>
          <li>
            도입(현황 제시) - 전개(원인 분석) - 마무리(미래 전망)의 구조가 매우
            체계적이고 논리적입니다.
          </li>
          <li>
            '-에 그쳤다', '격차를 좁혔다', '~이 원인으로 분석된다', '~ㄹ 것으로
            전망된다' 등 자료 해석에 필요한 중급 이상의 표현을 매우 효과적으로
            사용했습니다.
          </li>
        </ul>
      </Card>
      <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-[513px]">
        <p className="font-semibold">약점</p>
        <p>약점이 발견 되지 않았어요!</p>
      </Card>
      <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-[513px]">
        <p className="font-semibold">개선 방안</p>
        <p>
          모든 평가 항목에서 만점을 받은 완벽한 답안입니다. 현재의 뛰어난 글쓰기
          실력을 계속 유지하시기 바랍니다.
        </p>
      </Card>
    </>
  );
}

function ModelSolutionReview() {
  return (
    <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-[513px]">
      <p className="font-semibold">모범 답안</p>
      <p>
        ㉠ 관심이 생겼습니다
        <br />㉡ 즐거울 것 같습니다
      </p>
    </Card>
  );
}
