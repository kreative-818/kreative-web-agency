
import { NextResponse } from "next/server";
import { AISalesAgent } from "@/lib/ai-sales-agent-v2";

export async function GET() {
  try {
    const conversations = await AISalesAgent.getActiveConversations();

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get active conversations error:", error);
    return NextResponse.json(
      { error: "Failed to get conversations" },
      { status: 500 }
    );
  }
}

