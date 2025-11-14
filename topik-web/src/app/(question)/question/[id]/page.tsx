import { QuestionId } from "@/types/topik.types";
import QuestionLayout from "../_components/QuestionLayout";

export default async function QuestionPage({ params }: { params: Promise<{ id: QuestionId }> }) {
  const { id } = await params;

  return (
    <>
      <div className="font-semibold text-[20px] w-full px-7.5 pb-7.5 ">TOPIK II | 쓰기 | {id}번 유형</div>
      <QuestionLayout id={id} />
    </>
  );
}
