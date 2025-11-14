import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { QUESTION_IDS } from "@/config/topik-write.config";

export default function Header() {
  return (
    <header className="w-full py-5 bg-[#EBEBEB] flex justify-between items-center px-5">
      <div className="h-10 flex items-center">
        <Image src="/icons/icon-time-line.svg" alt="time-line" width={24} height={24} />
        <span className="px-1.25 ml-1.75 font-bold leading-7.5 text-[#102E81]">00:49:47</span>
      </div>

      <div className="flex gap-2 float-right">
        {QUESTION_IDS.map((id) => (
          <Link href={`/question/${id}`} key={id}>
            <Button className="bg-[#737373]">{id}번 문제</Button>
          </Link>
        ))}
      </div>
    </header>
  );
}
