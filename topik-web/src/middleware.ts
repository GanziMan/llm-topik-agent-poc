import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const QUESTION_NUMBER = ["51", "52", "53", "54"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const questionNumber = pathname.split("/")[2];

  if (!QUESTION_NUMBER.includes(questionNumber) || pathname === "/") {
    return NextResponse.redirect(new URL("/question/51", request.url));
  }

  const sessionCookie = request.cookies.get("session_id");

  if (!sessionCookie) {
    const sessionId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set("session_id", sessionId);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/question/:path*", "/"],
};
