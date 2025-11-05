import { QuestionId } from "@/types/topikWriteType";
import QuestionForm from "../_components/QuestionForm";
import { QuestionTitle } from "../mock";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: QuestionId }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-7.5">
      <p className="font-semibold text-[20px]">TOPIK II | 쓰기 | {id}번 유형</p>
      <div className="flex flex-col gap-7.5 max-w-[600px] mx-auto">
        <p className="font-semibold">
          {id}. {QuestionTitle(id)}
        </p>
        <QuestionForm id={id} />
      </div>
    </div>
  );
}
