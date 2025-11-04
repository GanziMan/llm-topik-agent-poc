import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const QUESTION_NUMBER = ["51", "52", "53", "54"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const questionNumber = pathname.split("/")[2];

  if (!QUESTION_NUMBER.includes(questionNumber) || pathname === "/") {
    return NextResponse.redirect(new URL("/question/51", request.url));
  }
}

export const config = {
  matcher: ["/problem/:path*", "/"],
};
