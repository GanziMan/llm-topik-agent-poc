import { QuestionId } from "@/types/topikWriteType";
import Contents from "../_components/Contents";
import { QuestionTitle } from "../mock";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: QuestionId }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-[30px]">
      <p className="font-semibold text-[20px]">TOPIK II | 쓰기 | {id}번 유형</p>
      <div className="flex flex-col gap-[30px] max-w-[600px] mx-auto">
        <p className="font-semibold">
          {id}. {QuestionTitle(id)}
        </p>
        <Contents id={id} />
      </div>
    </div>
  );
}
