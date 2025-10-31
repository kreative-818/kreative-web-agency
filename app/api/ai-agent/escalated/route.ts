
import { NextResponse } from "next/server";
import { AISalesAgent } from "@/lib/ai-sales-agent-v2";

export async function GET() {
  try {
    const escalated = await AISalesAgent.getEscalatedConversations();

    return NextResponse.json({
      success: true,
      escalated,
    });
  } catch (error) {
    console.error("Get escalated conversations error:", error);
    return NextResponse.json(
      { error: "Failed to get escalated conversations" },
      { status: 500 }
    );
  }
}

