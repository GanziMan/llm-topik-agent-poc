import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROBLEM_NUMBER = ["51", "52", "53", "54"];

// 이 함수는 내부에서 `await`를 사용하는 경우 `async`로 표시될 수 있습니다
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("pathname", pathname);
  const problemNumber = pathname.split("/")[2];

  if (!PROBLEM_NUMBER.includes(problemNumber) || pathname === "/") {
    return NextResponse.redirect(new URL("/problem/51", request.url));
  }
}

// 미들웨어는 기본적으로 애플리케이션의 모든 경로에서 호출된다.
// matcher 옵션을 사용하면 미들웨어를 특정 경로에서만 호출될 수 있도록 설정할 수 있다.
// 예를 들면 상단의 코드에서는 /about/:path* 경로에서만 미들웨어가 호출될 것이다.

export const config = {
  matcher: ["/problem/:path*", "/"],
};
