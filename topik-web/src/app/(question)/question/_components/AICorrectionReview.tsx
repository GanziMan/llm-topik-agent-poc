import { Card } from "@/components/ui/card";
import Image from "next/image";
import { QuestionId } from "@/types/topik.types";
import { CorrectionResponse } from "@/types/topik-correct.types";

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tooltip";

interface AICorrectionReviewProps {
  questionId: QuestionId;
  correctionResult?: CorrectionResponse;
  isLoading: boolean;
  error: string | null;
  initialScore: number;
}
// AI 첨삭
export default function AICorrectionReview({
  questionId,
  correctionResult,
  isLoading,
  error,
  initialScore,
}: AICorrectionReviewProps) {
  const isEssayQuestion = questionId === QuestionId.Q53 || questionId === QuestionId.Q54;

  if (!isEssayQuestion) {
    return (
      <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-[513px]">
        <p className="font-semibold">AI 첨삭</p>
        <p>53번, 54번 문제만 AI 첨삭 기능을 제공합니다.</p>
      </Card>
    );
  }

  if (isLoading) {
    return <MessageCard title="AI 첨삭" message="AI가 글을 첨삭하고 있습니다. 잠시만 기다려주세요..." />;
  }

  if (error) {
    return <MessageCard title="오류" message={error} />;
  }

  if (!correctionResult) {
    return null;
  }

  const { improvement_effects, edit_items } = correctionResult;
  const { expected_score_gain, key_improvements } = improvement_effects;
  const { vocabulary_spelling_corrections, sentence_corrections } = edit_items;

  return (
    <>
      <div className="flex flex-col justify-between gap-[19px]">
        <CorrectionCard
          title="교정 후 예측 점수"
          content={<ScoreChangeIndicator initialScore={initialScore} scoreGain={Number(expected_score_gain) || 0} />}
        />
        <div className="flex gap-5">
          <CorrectionCard title="어휘/맞춤법 교정" content={`${vocabulary_spelling_corrections?.length || 0}`} />
          <CorrectionCard title="문장 교정" content={`${sentence_corrections?.length || 0}`} />
        </div>

        <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-full">
          <p className="font-semibold">주요 개선 사항</p>
          <ul className="list-none list-inside ps-2">
            {key_improvements?.map((item, index) => (
              <li key={`improvement-${index}`}>
                {"•"} {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-full">
        <p className="font-semibold">AI 첨삭</p>
        <CorrectedEssayView correctionResult={correctionResult} />
      </Card>
    </>
  );
}

interface CorrectionCardProps {
  title: string;
  content: React.ReactNode;
}
function CorrectionCard({ title, content }: CorrectionCardProps) {
  return (
    <Card className="px-6 py-4 flex flex-col gap-[14px] w-full h-[110px]">
      <p className="font-semibold text-[#637381] text-sm">{title}</p>
      <div className="flex gap-[10px] text-2xl leading-7 font-bold">{content}</div>
    </Card>
  );
}

interface ScoreChangeIndicatorProps {
  initialScore: number;
  scoreGain: number;
}

function ScoreChangeIndicator({ initialScore, scoreGain }: ScoreChangeIndicatorProps) {
  const finalScore = initialScore + scoreGain;
  const isScoreGained = scoreGain > 0;

  return (
    <div className="flex items-center gap-2.5">
      <p className="text-lg font-bold">
        <span className="text-gray-400">{initialScore}점</span>
        <span className="mx-2">&rarr;</span>
        <span>{finalScore}점</span>
      </p>
      {isScoreGained && (
        <p className="flex items-center gap-0.5">
          <Image
            className="mt-0.5"
            src="/icons/icon-triangle-up-red.svg"
            alt="triangle-up-red icon"
            width={16}
            height={16}
          />
          <span className="text-[#FF645F] text-xs">
            {scoreGain} <span className="text-[#979AA0] text-[9px]">점</span>
          </span>
        </p>
      )}
    </div>
  );
}

function MessageCard({ title, message }: { title: string; message: string }) {
  return (
    <Card className="p-5 bg-[#F7F7F7] flex flex-col gap-[14px] w-full">
      <p className="font-semibold">{title}</p>
      <p>{message}</p>
    </Card>
  );
}

interface CorrectedEssayViewProps {
  correctionResult: CorrectionResponse;
}

function CorrectedEssayView({ correctionResult }: CorrectedEssayViewProps) {
  const { corrected_answer, edit_items } = correctionResult;

  if (!corrected_answer || !edit_items) {
    return <p>{correctionResult.overall_feedback || "첨삭 내용이 없습니다."}</p>;
  }

  const { vocabulary_spelling_corrections } = edit_items;
  const allCorrections = [...(vocabulary_spelling_corrections || [])];

  const matches: { start: number; end: number; reason: string; text: string }[] = [];

  allCorrections.forEach(({ revised, reason }) => {
    if (!revised) return;

    let lastIndex = -1;
    while ((lastIndex = corrected_answer.indexOf(revised, lastIndex + 1)) !== -1) {
      matches.push({
        start: lastIndex,
        end: lastIndex + revised.length,
        reason: reason,
        text: revised,
      });
    }
  });

  matches.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    return b.end - a.end;
  });

  const finalMatches: typeof matches = [];
  let lastEnd = -1;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      finalMatches.push(match);
      lastEnd = match.end;
    }
  }

  if (finalMatches.length === 0) {
    return <p className="whitespace-pre-wrap leading-relaxed">{corrected_answer}</p>;
  }

  const chunks: (string | React.JSX.Element)[] = [];
  let currentIndex = 0;

  finalMatches.forEach((match, i) => {
    chunks.push(corrected_answer.substring(currentIndex, match.start));

    chunks.push(
      <TooltipProvider key={`${match.start}-${i}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="bg-blue-100 underline decoration-blue-500 cursor-pointer">{match.text}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white border-0">
            <p>{match.reason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    currentIndex = match.end;
  });

  if (currentIndex < corrected_answer.length) {
    chunks.push(corrected_answer.substring(currentIndex));
  }

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {chunks.map((chunk, index) => (
        <React.Fragment key={index}>{chunk}</React.Fragment>
      ))}
    </div>
  );
}
