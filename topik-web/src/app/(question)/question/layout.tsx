export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="w-full h-full p-7.5">{children}</section>;
}
