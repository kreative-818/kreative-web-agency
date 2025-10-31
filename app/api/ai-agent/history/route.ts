
import { NextRequest, NextResponse } from "next/server";
import { AISalesAgent } from "@/lib/ai-sales-agent-v2";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const conversation = await AISalesAgent.getConversation(sessionId);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      conversation: conversation.conversation,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: "Failed to get conversation" },
      { status: 500 }
    );
  }
}

