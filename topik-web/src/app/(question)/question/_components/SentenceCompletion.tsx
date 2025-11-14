"use client";

import SentenceCompletionInput from "./SentenceCompletionInput";
import { SentenceCompletionAnswer } from "@/types/topik-write.types";
import { QuestionId } from "@/types/topik.types";
import { QuestionContents } from "../mock";

const answerFields = [
  { icon: "ㄱ", key: "answer1" as const },
  { icon: "ㄴ", key: "answer2" as const },
];

interface SentenceCompletionProps {
  id: QuestionId.Q51 | QuestionId.Q52;
  handleSentenceCompletionAnswerChange: (icon: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  sentenceCompletionAnswer: SentenceCompletionAnswer;
  inputDisabled: boolean;
  isSubmitted: boolean;
}
export default function SentenceCompletion({
  id,
  handleSentenceCompletionAnswerChange,
  sentenceCompletionAnswer,
  inputDisabled,
  isSubmitted,
}: SentenceCompletionProps) {
  return (
    <>
      <div className="flex flex-col border border-[#B4B4B4]">{QuestionContents[id]}</div>
      <div className="flex flex-col gap-5">
        {answerFields.map((field) => (
          <SentenceCompletionInput
            key={field.icon}
            icon={field.icon}
            value={sentenceCompletionAnswer[field.key]}
            onChange={handleSentenceCompletionAnswerChange}
            disabled={inputDisabled}
            isSubmitted={isSubmitted}
          />
        ))}
      </div>
    </>
  );
}
