import { kyInstance } from "@/lib/ky";
import { NextResponse } from "next/server";
import { TopikWritingEvaluatorRunResponse } from "@/types/topikWriteType";
import { topikWritingEvaluatorRequestSchema } from "@/app/schemas/topikWriteSchema";
import { isHTTPError, isKyError, isTimeoutError } from "ky";
import { cookies } from "next/headers";

const APP = process.env.AGENT_APP ?? "topik_writing_evaluator";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value ?? "";
  const userId = crypto.randomUUID();

  await initTopikWritingEvaluatorSession(APP, userId, sessionId);

  const clientTopikWritingEvaluatorRequest = await request.json();
  try {
    const { success, data, error } =
      topikWritingEvaluatorRequestSchema.safeParse(
        clientTopikWritingEvaluatorRequest
      );

    if (!success) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const { questionNumber, questionPrompt, answer, answerCharCount } = data;

    const topikWritingEvaluatorResponse = await kyInstance
      .post("run", {
        json: topikWritingEvaluatorRequest(
          JSON.stringify({
            question_number: Number(questionNumber),
            question_prompt: questionPrompt,
            answer,
            ...(answerCharCount !== undefined && {
              answer_char_count: answerCharCount,
            }),
          }),
          userId,
          sessionId
        ),
      })
      .json<TopikWritingEvaluatorRunResponse>();

    const topikWritingEvaluatorResponseEvent =
      topikWritingEvaluatorResponse[0].content.parts[0].text;
    const jsonString = topikWritingEvaluatorResponseEvent?.replace(
      /^```json\s*|```$/g,
      ""
    );

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

function topikWritingEvaluatorRequest(
  text: string,
  userId: string,
  sessionId: string
) {
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

async function initTopikWritingEvaluatorSession(
  app: string,
  user: string,
  session: string
) {
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
