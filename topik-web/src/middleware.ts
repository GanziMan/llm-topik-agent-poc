import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const QUESTION_NUMBER = ["51", "52", "53", "54"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const questionNumber = pathname.split("/")[2];

  if (!QUESTION_NUMBER.includes(questionNumber) || pathname === "/") {
    return NextResponse.redirect(new URL("/question/51", request.url));
  }

  const sessionCookie = request.cookies.get("topik_token");

  if (!sessionCookie) {
    const topikToken = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set("topik_token", topikToken);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/question/:path*"],
};
