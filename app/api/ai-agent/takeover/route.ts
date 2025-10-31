
import { NextRequest, NextResponse } from "next/server";
import { AISalesAgent } from "@/lib/ai-sales-agent-v2";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, humanName } = await request.json();

    if (!sessionId || !humanName) {
      return NextResponse.json(
        { error: "Missing sessionId or humanName" },
        { status: 400 }
      );
    }

    const success = await AISalesAgent.takeoverConversation(
      sessionId,
      humanName
    );

    if (!success) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Human takeover successful",
    });
  } catch (error) {
    console.error("Takeover error:", error);
    return NextResponse.json(
      { error: "Failed to takeover conversation" },
      { status: 500 }
    );
  }
}

