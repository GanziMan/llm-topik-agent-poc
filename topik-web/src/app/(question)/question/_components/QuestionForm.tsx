"use client";

import { useEffect } from "react";
import { QuestionTitle } from "../mock";
import { SentenceCompletionAnswer } from "@/types/topik-write.types";

import { QuestionId } from "@/types/topik.types";
import Essay from "./Essay";
import SentenceCompletion from "./SentenceCompletion";

interface QuestionFormProps {
  id: QuestionId;
  isLoading: boolean;
  handleSentenceCompletionAnswerChange: (icon: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEssayChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sentenceCompletionAnswer: SentenceCompletionAnswer;
  essayAnswer: string;
  inputDisabled: boolean;
  isSubmitted: boolean;
}

function QuestionFormComponent({
  id,
  isLoading,
  handleSentenceCompletionAnswerChange,
  handleEssayChange,
  sentenceCompletionAnswer,
  essayAnswer,
  inputDisabled,
  isSubmitted,
}: QuestionFormProps) {
  switch (id) {
    case QuestionId.Q51:
    case QuestionId.Q52:
      return (
        <SentenceCompletion
          id={id}
          handleSentenceCompletionAnswerChange={handleSentenceCompletionAnswerChange}
          sentenceCompletionAnswer={sentenceCompletionAnswer}
          inputDisabled={inputDisabled || isLoading}
          isSubmitted={isSubmitted}
        />
      );
    case QuestionId.Q53:
    case QuestionId.Q54:
      return (
        <Essay
          id={id}
          handleEssayChange={handleEssayChange}
          essayAnswer={essayAnswer}
          inputDisabled={inputDisabled || isLoading}
        />
      );
  }
}

export default function QuestionForm(props: QuestionFormProps) {
  const { id } = props;

  return (
    <div className="p-7.5 flex flex-col gap-7.5 bg-white max-w-[553px]">
      <p className="font-semibold">
        {id}. {QuestionTitle(id)}
      </p>
      <QuestionFormComponent {...props} />
    </div>
  );
}
