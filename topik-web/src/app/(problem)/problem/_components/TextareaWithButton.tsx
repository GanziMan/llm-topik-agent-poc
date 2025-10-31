"use client";

import Image from "next/image";

export default function TextareaWithButton({
  maxLength = 700,
  essayAnswer,
  onChange,
}: {
  maxLength?: number;
  essayAnswer?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-[10px]">
      <textarea
        className="w-full h-[136px] px-5 py-[15px] border-[0.5px] border-[#B3B3B3] rounded-[10px] resize-none"
        placeholder="내용을 입력하세요."
        value={essayAnswer}
        onChange={onChange}
      />

      <div className="flex items-center justify-between">
        <div className="flex gap-[10px]">
          <Button type="upload" text="답안지 업로드" />
          <Button type="eye" text="원고지 보기" />
        </div>
        <span className="float-right text-[#9D9D9D]">
          {essayAnswer?.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}
function Button({ type, text }: { type: "upload" | "eye"; text: string }) {
  return (
    <button className="cursor-pointer flex items-center gap-[10px] p-[10px] border-[0.5px] border-[#C8C8C8] rounded-[10px]">
      <Image
        src={`/icons/icon-${type}.svg`}
        alt={type}
        width={24}
        height={24}
      />
      <span>{text}</span>
    </button>
  );
}
