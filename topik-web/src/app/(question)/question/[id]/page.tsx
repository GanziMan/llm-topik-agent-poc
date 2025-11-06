import { QuestionId } from "@/types/topikWriteType";
import QuestionForm from "../_components/QuestionForm";
import { QuestionTitle } from "../mock";
import SolutionReview from "../_components/SolutionReview";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: QuestionId }>;
}) {
  const { id } = await params;
  return (
    <div className="flex gap-7.5">
      <div className="p-7.5 flex flex-col gap-7.5 bg-white">
        <p className="font-semibold text-[20px]">
          TOPIK II | 쓰기 | {id}번 유형
        </p>
        <div className="flex flex-col gap-7.5 max-w-[600px] mx-auto">
          <p className="font-semibold">
            {id}. {QuestionTitle(id)}
          </p>
          <QuestionForm id={id} />
        </div>
      </div>

      <SolutionReview />
    </div>
  );
}
