import { ApiClient } from "@/lib/ky";
import { NextResponse } from "next/server";
import { CorrectionResponse } from "@/types/topik-correct.types";

import { topikWritingCorrectorRequestSchemaWithEval } from "@/app/schemas/topik-write.schema";
import { isHTTPError, isKyError, isTimeoutError } from "ky";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";
import { IMAGE_MIME_TYPES_BY_EXT } from "@/config/topik-write.config";
import {
  ErrorResponse,
  LlmMessageRole,
  TopikWritingAgentRequest,
  TopikWritingAgentResponse,
} from "@/types/topik.types";

const AGENT_APP_NAME = process.env.AGENT_APP_CORRECTOR ?? "topik_writing_corrector";

type AgentUserMessagePart = { text: string } | { inline_data: { mime_type: string; data: string } };

export async function POST(request: Request): Promise<NextResponse<CorrectionResponse | ErrorResponse>> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value ?? "";
  const userId = cookieStore.get("user_id")?.value ?? "";

  const clientRequest = await request.json();

  try {
    const { success, data: parsedData, error } = topikWritingCorrectorRequestSchemaWithEval.safeParse(clientRequest);

    if (!success) {
      console.error("validation error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { questionNumber, questionPrompt, answer, imageUrl, evaluationResult } = parsedData;

    const requestPayload = {
      question_number: Number(questionNumber),
      question_prompt: questionPrompt,
      answer,
      evaluation_result: evaluationResult,
    };

    const agentUserMessageParts: Array<AgentUserMessagePart> = [{ text: JSON.stringify(requestPayload) }];

    if (imageUrl) {
      try {
        const relative = imageUrl.replace(/^\//, "");
        const filePath = path.join(process.cwd(), "public", relative);
        const buffer = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = IMAGE_MIME_TYPES_BY_EXT[ext] ?? "application/octet-stream";

        agentUserMessageParts.push({
          inline_data: { mime_type: mimeType, data: buffer.toString("base64") },
        });
      } catch (e) {
        console.error("Failed to attach image for correction:", e);
      }
    }

    const agentResponse = await ApiClient.post<TopikWritingAgentRequest, TopikWritingAgentResponse>(
      "run",
      TopikWritingAgentRunRequest(AGENT_APP_NAME, agentUserMessageParts, userId, sessionId)
    );

    const eventText = agentResponse[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(eventText) as CorrectionResponse);
  } catch (err) {
    console.error("correction error:", err);

    const errorBase = { error: "Agent proxy failed" };
    if (isHTTPError(err)) {
      return NextResponse.json(
        { ...errorBase, code: "HTTP_ERROR", details: err.message },
        { status: err.response.status }
      );
    }
    if (isKyError(err)) {
      return NextResponse.json({ ...errorBase, code: "KY_ERROR", details: err.message }, { status: 500 });
    }
    if (isTimeoutError(err)) {
      return NextResponse.json({ ...errorBase, code: "TIMEOUT", details: err.message }, { status: 504 });
    }
    return NextResponse.json({ ...errorBase, code: "UNKNOWN_ERROR" }, { status: 500 });
  }
}

function TopikWritingAgentRunRequest(
  appName: string,
  parts: Array<AgentUserMessagePart>,
  userId: string,
  sessionId: string
): TopikWritingAgentRequest {
  return {
    app_name: appName,
    user_id: userId,
    session_id: sessionId,
    new_message: { parts, role: LlmMessageRole.USER },
  };
}
