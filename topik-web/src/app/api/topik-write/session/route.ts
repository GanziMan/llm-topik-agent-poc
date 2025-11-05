import { kyInstance } from "@/lib/ky";
import { NextResponse } from "next/server";
import { HTTPError } from "ky";

const APP = process.env.AGENT_APP ?? "topik_writing_evaluator";
const SESSION = process.env.AGENT_SESSION ?? "s_1";
const USER = process.env.AGENT_USER ?? "u_1";

/**
 * ADK Agent 세션을 확인하고, 없으면 생성합니다.
 * 이 API는 클라이언트에서 한 번만 호출하면 됩니다.
 */
export async function POST() {
  try {
    const sessionUrl = `apps/${APP}/users/${USER}/sessions/${SESSION}`;

    // 1. 세션이 이미 존재하는지 확인
    await kyInstance.get(sessionUrl);

    // 세션이 이미 존재하면 성공 응답 반환
    return NextResponse.json({
      success: true,
      message: "Session already exists.",
    });
  } catch (error) {
    // 2. 세션이 존재하지 않을 경우 (404 에러), 새로 생성
    if (error instanceof HTTPError && error.response.status === 404) {
      try {
        await kyInstance.post(`apps/${APP}/users/${USER}/sessions`, {
          json: { session_id: SESSION },
        });
        return NextResponse.json({
          success: true,
          message: "Session created successfully.",
        });
      } catch (creationError) {
        console.error("ADK Session creation failed:", creationError);
        return NextResponse.json(
          { success: false, error: "Failed to create ADK session." },
          { status: 500 }
        );
      }
    }

    // 3. 그 외 다른 종류의 에러 처리
    console.error("ADK Session check failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
