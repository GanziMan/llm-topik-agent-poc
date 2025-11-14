import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { QUESTION_IDS } from "./config/topik-write.config";
import { QuestionId } from "./types/topik.types";
import { AGENT_APP_CORRECTOR, AGENT_APP_EVALUATOR } from "./config/shared";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const questionNumber = pathname.split("/")[2];

  if (!QUESTION_IDS.includes(questionNumber as QuestionId) || pathname === "/") {
    return NextResponse.redirect(new URL(`/question/${QUESTION_IDS[0]}`, request.url));
  }

  const sessionCookie = request.cookies.get("session_id");
  const userCookie = request.cookies.get("user_id");

  if (!sessionCookie || !userCookie) {
    const response = NextResponse.next();
    const sessionId = sessionCookie?.value ?? crypto.randomUUID();
    const userId = userCookie?.value ?? crypto.randomUUID();

    if (!sessionCookie) {
      response.cookies.set("session_id", sessionId);
    }
    if (!userCookie) {
      response.cookies.set("user_id", userId);
    }

    try {
      await Promise.all([
        fetch(`${origin}/api/topik-write/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            app_name: AGENT_APP_EVALUATOR,
            user_id: userId,
            session_id: sessionId,
          }),
        }),
        fetch(`${origin}/api/topik-write/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            app_name: AGENT_APP_CORRECTOR,
            user_id: userId,
            session_id: sessionId,
          }),
        }),
      ]);
    } catch (error) {
      console.error("Failed to initialize agent sessions from middleware:", error);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/question/:path*", "/"],
};
