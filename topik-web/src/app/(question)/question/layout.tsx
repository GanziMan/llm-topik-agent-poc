export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="w-full h-full p-[30px]">{children}</section>;
}
