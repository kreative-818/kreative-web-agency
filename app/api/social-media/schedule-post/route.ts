
import { NextRequest, NextResponse } from "next/server";
import { scheduleSocialMediaPost } from "@/lib/social-media-automation";

export async function POST(request: NextRequest) {
  try {
    const { platform, content, scheduledFor, mediaUrls } = await request.json();

    if (!platform || !content || !scheduledFor) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await scheduleSocialMediaPost(
      platform,
      content,
      new Date(scheduledFor),
      mediaUrls
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Schedule post error:", error);
    return NextResponse.json(
      { error: "Failed to schedule post" },
      { status: 500 }
    );
  }
}

