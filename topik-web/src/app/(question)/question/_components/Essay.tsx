"use client";

import EssayInput from "./EssayInput";
import { QuestionId } from "@/types/topik.types";
import { QuestionContents } from "../mock";

interface EssayProps {
  id: QuestionId.Q53 | QuestionId.Q54;
  inputDisabled: boolean;
  handleEssayChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  essayAnswer: string;
}

const MAX_LENGTH_MAP = {
  [QuestionId.Q53]: 300,
  [QuestionId.Q54]: 700,
};

export default function Essay({ id, inputDisabled, handleEssayChange, essayAnswer }: EssayProps) {
  return (
    <>
      <div className="flex flex-col border border-[#B4B4B4]">{QuestionContents[id]}</div>
      <EssayInput
        maxLength={MAX_LENGTH_MAP[id]}
        essayAnswer={essayAnswer}
        onChange={handleEssayChange}
        disabled={inputDisabled}
      />
    </>
  );
}
