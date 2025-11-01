import { NextResponse } from "next/server";
import { z } from "zod";

const BASE = process.env.AGENT_BASE_URL!; // 예: http://localhost:3001
const APP = process.env.AGENT_APP ?? "topik_writer_grader"; // 예: topik_writer_grader
const SESSION = process.env.AGENT_SESSION ?? "s_1"; // 세션 없으면 기본값
const USER = process.env.AGENT_USER ?? "u_1"; // 사용자 없으면 기본값

// Zod 스키마 정의
const requestBodySchema = z
  .object({
    problem_id: z.enum(["51", "52", "53", "54"]),
    question: z.string().min(1, "Question cannot be empty."),
    answer: z.any(),
    char_count: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.problem_id === "51" || data.problem_id === "52") {
      const answerSchema = z.object({
        answer1: z.string(),
        answer2: z.string(),
      });
      const result = answerSchema.safeParse(data.answer);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["answer"],
          message:
            "For problem 51/52, answer must be an object with keys 'answer1' and 'answer2'",
        });
      }
    } else {
      // 53 or 54
      if (typeof data.answer !== "string" || data.answer.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["answer"],
          message: "For problem 53/54, answer must be a non-empty string.",
        });
      }
    }
  });

export async function POST(request: Request) {
  try {
    // 1) 요청 파싱 + 검증
    const rawBody = await request.json();

    const parsed = requestBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { problem_id, question, answer, char_count } = parsed.data;

    // 세션 존재 확인 및 생성 로직 추가
    try {
      const sessionUrl = `${BASE}/apps/${APP}/users/${USER}/sessions/${SESSION}`;
      const sessionCheck = await fetch(sessionUrl);

      if (sessionCheck.status === 404) {
        const createSession = await fetch(
          `${BASE}/apps/${APP}/users/${USER}/sessions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: SESSION }),
          }
        );
        if (!createSession.ok) {
          throw new Error(
            `Failed to create session: ${await createSession.text()}`
          );
        }
      } else if (!sessionCheck.ok) {
        throw new Error(
          `Failed to check session: ${await sessionCheck.text()}`
        );
      } else {
      }
    } catch (sessionError) {
      console.error("Session management failed:", sessionError);
      const errorMessage =
        sessionError instanceof Error
          ? sessionError.message
          : String(sessionError);
      return NextResponse.json(
        { error: "Session management failed", details: errorMessage },
        { status: 500 }
      );
    }

    // 2) 에이전트(모델) 입력 포맷 구성
    // 에이전트는 question_number, question_prompt, answer_text를 기대
    const agentInput = {
      question_number: parseInt(problem_id, 10),
      question_prompt: question,
      answer_text:
        problem_id === "51" || problem_id === "52"
          ? JSON.stringify(answer) // 51/52는 {answer1: 'xxx', answer2: 'yyy'} 객체를 문자열로
          : (answer as string), // 53/54는 본문 문자열
      ...(char_count !== undefined && { char_count }),
    };

    // 3) ADK /run 요청 페이로드 (snake_case)
    const adkPayload = {
      app_name: APP, // "topik_writer_grader"
      user_id: USER, // 예: "u_1"
      session_id: SESSION,
      new_message: {
        role: "user",
        parts: [
          {
            // 에이전트가 JSON 문자열을 text로 받도록 전달
            text: JSON.stringify(agentInput),
          },
        ],
      },
    };

    // 4) 호출
    const upstream = await fetch(`${BASE}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adkPayload),
    });
    console.log(adkPayload);
    console.log(JSON.stringify(adkPayload));

    // 5) ADK는 Event[] (camelCase) JSON을 반환
    const events = await upstream.json();

    const rawText = events[0].content.parts[0].text;

    // Markdown JSON 코드 블록 정리 (e.g., "```json\n{...}\n```" -> "{...}")
    const jsonString = rawText?.replace(/^```json\s*|```$/g, "");

    try {
      const resultJson = JSON?.parse(jsonString);
      // 최종 결과인 JSON 객체만 반환
      return NextResponse.json(resultJson);
    } catch (e) {
      console.error(
        "Failed to parse JSON from agent response:",
        e,
        "Raw string:",
        jsonString
      );
      // 파싱 실패 시 에러와 함께 정리된 문자열 반환
      return NextResponse.json(
        { error: "Failed to parse JSON from agent", text: jsonString },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return NextResponse.json(
      { error: "Agent proxy failed", details: String(err ?? err) },
      { status: 500 }
    );
  }
}
