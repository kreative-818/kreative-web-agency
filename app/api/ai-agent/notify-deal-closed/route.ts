
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiConversations, leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * NOTIFY DEAL CLOSED
 * 
 * Sends email notification when AI closes a deal
 * 
 * POST /api/ai-agent/notify-deal-closed
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Get conversation details
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.id, conversationId))
      .limit(1);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Check if this is a closed deal
    if (!conversation.dealClosed) {
      return NextResponse.json(
        { error: "Deal is not closed" },
        { status: 400 }
      );
    }

    // Create lead record
    if (conversation.visitorEmail) {
      await db.insert(leads).values({
        name: conversation.visitorName || "Unknown",
        email: conversation.visitorEmail,
        phone: conversation.visitorPhone || "",
        source: "ai_chatbot",
        status: "new",
        notes: `Deal closed by AI. Value: $${(conversation.dealValue || 0) / 100}. Intent: ${conversation.conversionIntent}`,
      });
    }

    // Send email notification to owner
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .deal-box { background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .deal-value { font-size: 32px; font-weight: bold; color: #10b981; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
        .info-label { font-weight: bold; color: #666; }
        .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 New Deal Closed!</h1>
            <p>Your AI Sales Agent just closed a deal autonomously</p>
        </div>
        <div class="content">
            <div class="deal-box">
                <div class="deal-value">$${((conversation.dealValue || 0) / 100).toFixed(2)}</div>
                <p style="color: #666; margin: 0;">Deal Value</p>
            </div>

            <h3>Customer Information</h3>
            <div class="info-row">
                <span class="info-label">Name:</span>
                <span>${conversation.visitorName || "Not provided"}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span>${conversation.visitorEmail || "Not provided"}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Phone:</span>
                <span>${conversation.visitorPhone || "Not provided"}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Session ID:</span>
                <span>${conversation.sessionId}</span>
            </div>

            <h3>Next Steps</h3>
            <p>The customer is expecting to receive:</p>
            <ul>
                <li>Payment/checkout link</li>
                <li>Project intake form</li>
                <li>Timeline confirmation</li>
                <li>Welcome email</li>
            </ul>

            <a href="https://kreativeaiagency.com/admin/ai-conversations" class="button">
                View Full Conversation
            </a>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                This is an automated notification from your AI Sales Agent.<br>
                Kreative Intelligence Web Agency LLC
            </p>
        </div>
    </div>
</body>
</html>
    `;

    // Send email using Resend (if configured)
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_123456789_placeholder") {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "AI Sales Agent <notifications@kreativeaiagency.com>",
            to: [process.env.OWNER_PHONE_NUMBER?.replace("+1", "") + "@txt.att.net"], // SMS via email gateway
            cc: [process.env.BUSINESS_EMAIL || "support@kreativewebagency.com"],
            subject: `🎉 New Deal Closed - $${((conversation.dealValue || 0) / 100).toFixed(2)}`,
            html: emailBody,
          }),
        });

        if (!emailResponse.ok) {
          console.error("Failed to send email notification");
        }
      } catch (emailError) {
        console.error("Email notification error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Deal notification sent successfully",
    });
  } catch (error: any) {
    console.error("Deal notification error:", error);
    return NextResponse.json(
      {
        error: "Failed to send deal notification",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
