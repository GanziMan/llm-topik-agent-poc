export default function Problem53() {
  return (
    <div className="flex flex-col border border-[#B4B4B4]">
      <div className="p-[30px] font-medium bg-[#fafafa]">
        <p className="font-bold text-2xl">인터넷의 장단점</p>
        <p className="font-bold">장점</p>
        <ol className="list-disc">
          <li className="ml-8">인터넷을 통해 정보를 얻을 수 있다.</li>
          <li className="ml-8">인터넷을 통해 소통을 할 수 있다.</li>
          <li className="ml-8">인터넷을 통해 쇼핑을 할 수 있다.</li>
        </ol>
        <p className="font-bold">단점</p>
        <ol className="list-disc">
          <li className="ml-8">인터넷을 통해 가짜 정보를 얻을 수 있다.</li>
          <li className="ml-8">인터넷을 통해 해킹을 당할 수 있다.</li>
          <li className="ml-8">인터넷을 통해 개인 정보를 유출할 수 있다.</li>
        </ol>
      </div>
    </div>
  );
}
