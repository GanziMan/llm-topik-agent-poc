export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-screen p-7.5 flex justify-center bg-[#F5F5F5]">
      {children}
    </section>
  );
}
