import Image from "next/image";

export default function Header() {
  return (
    <header className="relative w-full py-5 bg-[#EBEBEB] flex justify-center">
      <div className="absolute top-5.5 left-0 flex items-center">
        <Image
          src="/icons/icon-arrow-right.svg"
          alt="arrow-right"
          width={30}
          height={36}
        />
        <span className="ml-1.75 font-bold leading-7.5">종료하기</span>
      </div>
      <div className="h-10 flex items-center">
        <Image
          src="/icons/icon-time-line.svg"
          alt="time-line"
          width={24}
          height={24}
        />
        <span className="px-1.25 ml-1.75 font-bold leading-7.5 text-[#102E81]">
          00:49:47
        </span>
      </div>
    </header>
  );
}
