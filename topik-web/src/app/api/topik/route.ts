import { kyInstance } from "@/lib/ky";
import { NextResponse } from "next/server";
import { AdkRunResponse } from "@/app/types";
import { topikWritingEvaluatorRequestSchema } from "@/app/schema";
import { isHTTPError, isKyError, isTimeoutError } from "ky";
import { cookies } from "next/headers";

const APP = process.env.AGENT_APP ?? "topik_writing_evaluator";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("topik_token")?.value ?? "";
  const userId = crypto.randomUUID();
  await initAdkSession(APP, userId, sessionId);

  console.log(request);
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

    const adkResponse = await kyInstance
      .post("run", {
        json: adkRequest(
          JSON.stringify({
            question_number: Number(problemId),
            question_prompt: questionPrompt,
            answer,
            ...(charCount !== undefined && { char_count: charCount }),
          }),
          userId,
          sessionId
        ),
      })
      .json<AdkRunResponse>();

    const adkResponseEvent = adkResponse[0].content.parts[0].text;
    const jsonString = adkResponseEvent?.replace(/^```json\s*|```$/g, "");

    return NextResponse.json(JSON.parse(jsonString));
  } catch (err) {
    if (isHTTPError(err)) {
      return NextResponse.json(
        { error: "Agent proxy failed", details: err.message },
        { status: err.response.status }
      );
    }
    if (isKyError(err)) {
      return NextResponse.json(
        { error: "Agent proxy failed", details: err.message },
        { status: 500 }
      );
    }
    if (isTimeoutError(err)) {
      return NextResponse.json(
        { error: "Agent proxy failed", details: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Agent proxy failed" }, { status: 500 });
  }
}

function adkRequest(text: string, userId: string, sessionId: string) {
  return {
    app_name: APP,
    user_id: userId,
    session_id: sessionId,

    new_message: {
      parts: [{ text }],
      role: "user",
    },
  };
}

async function initAdkSession(app: string, user: string, session: string) {
  try {
    await kyInstance.get(`apps/${app}/users/${user}/sessions/${session}`);
  } catch (e) {
    if (isHTTPError(e) && e.response.status === 404) {
      await kyInstance.post(`apps/${app}/users/${user}/sessions`, {
        json: { session_id: session },
      });
    } else {
      throw e;
    }
  }
}
