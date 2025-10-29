export default function Footer({ children }: { children: React.ReactNode }) {
  return (
    <footer className="fixed bottom-0 w-full px-[30px] py-5 bg-[#EBEBEB] flex justify-end">
      {children}
    </footer>
  );
}
