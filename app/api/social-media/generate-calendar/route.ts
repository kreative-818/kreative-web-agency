
import { NextRequest, NextResponse } from "next/server";
import { generateContentCalendar } from "@/lib/social-media-automation";

export async function POST(request: NextRequest) {
  try {
    const { days = 30 } = await request.json();

    const calendar = await generateContentCalendar(days);

    return NextResponse.json({
      success: true,
      calendar,
      message: `Generated ${calendar.length} posts for the next ${days} days`,
    });
  } catch (error) {
    console.error("Content calendar generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content calendar" },
      { status: 500 }
    );
  }
}

