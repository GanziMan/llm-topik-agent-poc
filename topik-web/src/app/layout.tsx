import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOPIK | 주관식 문항 평가",
  description: "TOPIK 주관식 문항 평가 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mb-22.5`}
      >
        <Header />
        {children}
        <Footer>
          <button className="w-20 h-12.5 bg-[#737373] text-white rounded-[10px] cursor-pointer">
            풀이 완료
          </button>
        </Footer>
      </body>
    </html>
  );
}
