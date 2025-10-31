
import { NextResponse } from "next/server";
import { generateContentCalendar, generateAIContent } from "@/lib/content-strategy";
import { postToFacebook, postToInstagram } from "@/lib/facebook-automation";

/**
 * SCHEDULE SOCIAL MEDIA POSTS
 * 
 * POST /api/social-media/schedule
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, platform, content, imageUrl, scheduledDate } = body;

    if (action === "generate_calendar") {
      // Generate 30-day content calendar
      const calendar = await generateContentCalendar();

      return NextResponse.json({
        success: true,
        calendar,
        message: "Content calendar generated successfully",
      });
    }

    if (action === "generate_content") {
      // Generate AI-powered content
      const content = await generateAIContent({
        contentType: body.contentType,
        platform: body.platform,
        topic: body.topic,
        tone: body.tone,
      });

      return NextResponse.json({
        success: true,
        content,
      });
    }

    if (action === "post_now" || action === "schedule_post") {
      // Post to social media
      const postDate = action === "schedule_post" ? new Date(scheduledDate) : undefined;

      let result;
      if (platform === "facebook") {
        result = await postToFacebook({
          message: content,
          imageUrl,
          scheduled: postDate,
        });
      } else if (platform === "instagram") {
        if (!imageUrl) {
          return NextResponse.json(
            { error: "Instagram posts require an image" },
            { status: 400 }
          );
        }
        result = await postToInstagram({
          caption: content,
          imageUrl,
        });
      } else {
        return NextResponse.json(
          { error: "Unsupported platform" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        result,
        message: `Post ${action === "schedule_post" ? "scheduled" : "published"} successfully`,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Social media scheduling error:", error);
    return NextResponse.json(
      {
        error: "Failed to process social media request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET SCHEDULED POSTS
 * 
 * GET /api/social-media/schedule
 */
export async function GET(request: Request) {
  try {
    // Generate content calendar
    const calendar = await generateContentCalendar();

    return NextResponse.json({
      success: true,
      calendar,
    });
  } catch (error: any) {
    console.error("Failed to get scheduled posts:", error);
    return NextResponse.json(
      {
        error: "Failed to get scheduled posts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
