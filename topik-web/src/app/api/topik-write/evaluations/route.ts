import { ApiClient } from "@/lib/ky";
import { NextResponse } from "next/server";
import { EvaluationResponseUnion } from "@/types/topik-write.types";
import { topikWritingEvaluatorRequestSchema } from "@/app/schemas/topik-write.schema";
import { isHTTPError, isKyError, isTimeoutError } from "ky";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";
import { IMAGE_MIME_TYPES_BY_EXT } from "@/config/topik-write.config";
import { AGENT_APP_EVALUATOR } from "@/config/shared";
import {
  AgentUserMessagePart,
  ErrorResponse,
  LlmMessageRole,
  TopikWritingAgentRequest,
  TopikWritingAgentResponse,
} from "@/types/topik.types";

export async function POST(request: Request): Promise<NextResponse<EvaluationResponseUnion | ErrorResponse>> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value ?? "";
  const userId = cookieStore.get("user_id")?.value ?? "";

  const clientEvaluationRequest = await request.json();
  try {
    const { success, data: parsedData, error } = topikWritingEvaluatorRequestSchema.safeParse(clientEvaluationRequest);

    if (!success) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { questionNumber, questionPrompt, answer, imageUrl } = parsedData;

    const evaluationInputPayload = {
      question_number: Number(questionNumber),
      question_prompt: questionPrompt,
      answer,
    } as Record<string, unknown>;

    const agentUserMessageParts: Array<AgentUserMessagePart> = [{ text: JSON.stringify(evaluationInputPayload) }];

    if (imageUrl) {
      try {
        const relative = imageUrl.replace(/^\//, "");
        const filePath = path.join(process.cwd(), "public", relative); // 이미지 파일 경로
        const buffer = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = IMAGE_MIME_TYPES_BY_EXT[ext] ?? "application/octet-stream";

        agentUserMessageParts.push({
          inline_data: { mime_type: mimeType, data: buffer.toString("base64") },
        });
      } catch (e) {
        console.error("Failed to attach image for evaluation:", e);
      }
    }

    const topikWritingEvaluatorResponse = await ApiClient.post<TopikWritingAgentRequest, TopikWritingAgentResponse>(
      "run",
      TopikWritingEvaluatorRequest(agentUserMessageParts, userId, sessionId)
    );

    const topikWritingEvaluatorResponseEvent = topikWritingEvaluatorResponse[0].content.parts[0].text;

    return NextResponse.json(JSON.parse(topikWritingEvaluatorResponseEvent));
  } catch (err) {
    console.error("evaluation error:", err);

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

function TopikWritingEvaluatorRequest(
  parts: Array<AgentUserMessagePart>,
  userId: string,
  sessionId: string
): TopikWritingAgentRequest {
  return {
    app_name: AGENT_APP_EVALUATOR,
    user_id: userId,
    session_id: sessionId,
    new_message: { parts, role: LlmMessageRole.USER },
  };
}
