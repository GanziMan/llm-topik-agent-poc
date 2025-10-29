import Contents from "../_components/Contents";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-[30px]">
      <p className="font-semibold text-[20px]">TOPIK II | 쓰기 | {id}번 유형</p>
      <div className="flex flex-col gap-[30px] max-w-[600px] mx-auto">
        <p className="font-semibold">
          {id}. {ProblemTitle(id)}
        </p>
        <Contents id={id} />
      </div>
    </div>
  );
}

function ProblemTitle(id: string) {
  switch (id) {
    case "54":
      return "다음을 참고하여 600~700자로 글을 쓰시오. 단, 문제를 그대로 옮겨 쓰지마시오. (50점)";
    case "53":
      return "다음을 참고하여 ‘인터넷의 장단점’에 대한 글을 200~300자로 쓰십시오. 단, 글의 제목을 쓰지 마십시오. (30점)";
    default:
      return "다음 글의 ㄱ과 ㄴ에 알맞은 말을 각각 쓰시오.  (각 10점)";
  }
}
