import { kyInstance } from "@/lib/ky";
import { NextResponse } from "next/server";

import { AdkRunResponse } from "@/app/types";
import { topikWritingEvaluatorRequestSchema } from "@/app/schema";
import { isHTTPError, isKyError, isTimeoutError } from "ky";

const APP = process.env.AGENT_APP ?? "topik_writing_evaluator";
const SESSION = process.env.AGENT_SESSION ?? "session_1";
const USER = process.env.AGENT_USER ?? "user_1";

export async function POST(request: Request) {
  try {
    const topikWritingEvaluatorRequest = await request.json();

    const { success, data, error } =
      topikWritingEvaluatorRequestSchema.safeParse(
        topikWritingEvaluatorRequest
      );

    if (!success) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const { problemId, questionPrompt, answer, charCount } = data;

    try {
      await kyInstance.get(`apps/${APP}/users/${USER}/sessions/${SESSION}`);
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        await kyInstance.post(`apps/${APP}/users/${USER}/sessions`, {
          json: { sessionId: SESSION },
        });
      }
    }

    const adkResponse = await kyInstance
      .post("run", {
        json: adkRequest(
          JSON.stringify({
            question_number: Number(problemId),
            question_prompt: questionPrompt,
            answer,
            ...(charCount !== undefined && { char_count: charCount }),
          })
        ),
      })
      .json<AdkRunResponse>();

    const adkResponseEvent = adkResponse[0].content.parts[0].text;
    const jsonString = adkResponseEvent?.replace(/^```json\s*|```$/g, "");

    return NextResponse.json(JSON.parse(jsonString));
  } catch (err) {
    if (isHTTPError(err)) {
      console.log(err.response.status);
      return NextResponse.json(
        { error: "Agent proxy failed", details: err.message },
        { status: err.response.status }
      );
    }
    if (isKyError(err)) {
      console.log("에러3");
      return NextResponse.json(
        { error: "Agent proxy failed", details: err.message },
        { status: 500 }
      );
    }
    if (isTimeoutError(err)) {
      console.log("에러4");
      return NextResponse.json(
        { error: "Agent proxy failed", details: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Agent proxy failed" }, { status: 500 });
  }
}

function adkRequest(text: string) {
  return {
    app_name: APP,
    user_id: USER,
    session_id: SESSION,

    new_message: {
      parts: [{ text }],
      role: "user",
    },
  };
}
