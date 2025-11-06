export default function Footer({ children }: { children: React.ReactNode }) {
  return (
    <footer className="fixed bottom-0 w-full px-7.5 py-5 bg-[#EBEBEB] flex justify-end">
      {children}
    </footer>
  );
}
