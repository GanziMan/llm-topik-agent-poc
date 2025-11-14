import { QuestionId } from "@/types/topik.types";
import Image from "next/image";

export const QuestionContents: Record<QuestionId, React.ReactNode> = {
  [QuestionId.Q51]: (
    <div className="p-7.5 font-medium bg-[#fafafa]">
      한 달 전에 이사를 했습니다. 그동안 집안 정리 때문에 정신이 없었는데 이제 좀 정리가 됐습니다. 그래서 저희 집에서 (
      ᄀ ) <br />( ᄂ ) 그 시간이 괜찮으신지 연락 주시면 감사하겠습니다.
    </div>
  ),
  [QuestionId.Q52]: (
    <div className="p-7.5 font-medium bg-[#fafafa]">
      스트레스를 받았을 때 사탕이나 과자와 같이 단 음식을 먹으면 기분이 좋아진다. 단 음식으로 인해 뇌에서 기분을 좋게
      만드는 호르몬이 나오기 때문이다. 그런데 전문가들은 사람들이 술이나 담배에 중독되는 것처럼 단맛에도 ( ㄱ ). 따라서
      평소에 단 음식을 지나치게 많이 ( ㄴ ) 주의할 필요가 있다.
    </div>
  ),
  [QuestionId.Q53]: <Image src="/images/mock/img-53problem.jpeg" alt="problem" width={553} height={300} />,
  [QuestionId.Q54]: (
    <>
      <div className="p-7.5 font-medium bg-[#fafafa]">
        오늘날 우리는 정보 통신 기술의 발달로 누구나 쉽게 정보를 생산하고 대중에게 전달할 수 있다. 그런데 정보의 생산과
        유통을 통해 개인과 집단이 이익을 얻을 수 있게 되면서 사실과 다른 가짜 뉴스가 늘어나고 있다. 아래의 내용을
        중심으로 ‘가짜 뉴스의 등장이 사회에 미치는 영향&apos;에 대한 자신의 생각을 쓰라.
      </div>
      <div className="p-5 font-medium border-t-[0.5px] border-[#DDDDDD]">
        <p>가짜 뉴스가 생겨나는 사회적 배경은 무엇인가?</p>
        <p>가짜 뉴스로 인해 어떤 문제가 생길 수 있는가?</p>
        <p>이런 문제들을 해결하기 위해 어떤 방안이 필요한가?</p>
      </div>
    </>
  ),
};

export function QuestionTitle(id: QuestionId) {
  switch (id) {
    case QuestionId.Q54:
      return "다음을 참고하여 600~700자로 글을 쓰시오. 단, 문제를 그대로 옮겨 쓰지마시오. (50점)";
    case QuestionId.Q53:
      return "다음은 ‘편의점 매출액 변화'에 대한 자료이다. 이 내용을 200~300자의 글로 쓰시오. 단, 글의 제목은 쓰지 마시오 (30점)";
    default:
      return "다음 글의 ㄱ과 ㄴ에 알맞은 말을 각각 쓰시오. (각 10점)";
  }
}

export function QuestionPrompt(id: QuestionId, context?: string) {
  switch (id) {
    case QuestionId.Q53:
      return `${QuestionTitle(id)}`;
    default:
      return `${QuestionTitle(id)} \n\n${context}`;
  }
}
