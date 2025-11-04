"use client";

import Image from "next/image";

export default function InputUpload({
  icon = "ㄱ",
  value,
  onChange,
}: {
  icon?: string;
  value: string;
  onChange?: (icon: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <div className="w-[33px] h-[33px] rounded-full absolute top-[15px] left-5 border-[#B3B3B3] border-[0.5px] flex items-center justify-center">
        {icon}
      </div>
      <Image
        src="/icons/icon-upload.svg"
        alt="upload"
        width={24}
        height={24}
        className="absolute top-5 right-5"
      />

      <input
        type="text"
        className="w-full h-[63px] pl-[63px] py-[15px] border-[0.5px] border-[#B3B3B3] rounded-[10px]"
        placeholder="내용을 입력하세요."
        value={value}
        onChange={(e) => onChange?.(icon, e)}
      />
    </div>
  );
}
