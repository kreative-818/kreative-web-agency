
import { NextRequest, NextResponse } from "next/server";
import { AISalesAgent } from "@/lib/ai-sales-agent-v2";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Missing sessionId or message" },
        { status: 400 }
      );
    }

    // Initialize or load conversation
    const agent = await AISalesAgent.initConversation(sessionId);

    // Process message
    const result = await agent.chat(message);

    return NextResponse.json({
      success: true,
      response: result.response,
      shouldEscalate: result.shouldEscalate,
      escalationReason: result.escalationReason,
      leadCaptured: result.leadCaptured,
      conversationEnded: result.conversationEnded,
    });
  } catch (error) {
    console.error("AI Agent chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

