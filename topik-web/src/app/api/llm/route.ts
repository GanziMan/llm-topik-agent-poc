import { kyInstance } from "@/lib/ky";
import { NextResponse } from "next/server";

import { AdkRunResponse } from "@/app/types";
import { topikWritingEvaluatorRequestSchema } from "@/app/schema";

const APP = process.env.AGENT_APP ?? "topik_writing_evaluator"; // topik_writing_evaluator
const SESSION = process.env.AGENT_SESSION ?? "s_1"; // 세션 없으면 기본값
const USER = process.env.AGENT_USER ?? "u_1"; // 사용자 없으면 기본값

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    const { success, data, error } =
      topikWritingEvaluatorRequestSchema.safeParse(rawBody);

    if (!success) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const { problem_id, question_prompt, answer, char_count } = data;

    const sessionUrl = `apps/${APP}/users/${USER}/sessions/${SESSION}`;
    try {
      await kyInstance.get(sessionUrl);
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        await kyInstance.post(`apps/${APP}/users/${USER}/sessions`, {
          json: { session_id: SESSION },
        });
      }
    }

    const agentInput = {
      question_number: parseInt(problem_id, 10),
      question_prompt: question_prompt,
      answer,
      ...(char_count !== undefined && { char_count }),
    };

    const json = {
      app_name: APP,
      user_id: USER, // 예: "u_1"
      session_id: SESSION,
      new_message: {
        role: "user",
        parts: [
          {
            text: JSON.stringify(agentInput),
          },
        ],
      },
    };

    const response = await kyInstance
      .post("run", { json })
      .json<AdkRunResponse>();

    const rawText = response[0].content.parts[0].text;

    const jsonString = rawText?.replace(/^```json\s*|```$/g, "");

    try {
      return NextResponse.json(JSON.parse(jsonString));
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
