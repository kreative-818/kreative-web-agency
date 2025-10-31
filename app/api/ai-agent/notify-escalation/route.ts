
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { escalations, aiConversations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// This endpoint is called automatically when a conversation is escalated
// to send notifications to the owner

export async function POST(request: NextRequest) {
  try {
    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing conversationId" },
        { status: 400 }
      );
    }

    // Get conversation and escalation details
    const conversation = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.id, conversationId))
      .limit(1);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const escalation = await db
      .select()
      .from(escalations)
      .where(
        and(
          eq(escalations.conversationId, conversationId),
          eq(escalations.notificationSent, false)
        )
      )
      .limit(1);

    if (escalation.length === 0) {
      return NextResponse.json(
        { error: "No pending escalation found" },
        { status: 404 }
      );
    }

    const conv = conversation[0];
    const esc = escalation[0];

    // Send SMS notification via OpenPhone
    const phoneNumber = process.env.OWNER_PHONE_NUMBER;
    if (phoneNumber) {
      const message = `🚨 AI ESCALATION NEEDED\n\n${esc.reason}\n\nVisitor: ${
        conv.visitorName || "Unknown"
      }\nEmail: ${conv.visitorEmail || "Not provided"}\nPhone: ${
        conv.visitorPhone || "Not provided"
      }\nEstimated Value: $${
        conv.estimatedValue ? (conv.estimatedValue / 100).toFixed(0) : "0"
      }\n\nView: https://kreativeaiagency.com/admin/ai-conversations\n\nUrgency: ${
        esc.urgency
      }`;

      try {
        await fetch("https://api.openphone.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENPHONE_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.OPENPHONE_PHONE_NUMBER,
            to: [phoneNumber],
            content: message,
          }),
        });
      } catch (smsError) {
        console.error("Failed to send SMS notification:", smsError);
      }
    }

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY && process.env.BUSINESS_EMAIL) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: `Kreative Intelligence <${process.env.BUSINESS_EMAIL}>`,
            to: [process.env.BUSINESS_EMAIL],
            subject: `🚨 AI Escalation: ${esc.reason}`,
            html: `
              <h2>AI Sales Agent Needs Your Help</h2>
              <p><strong>Reason:</strong> ${esc.reason}</p>
              <p><strong>Urgency:</strong> ${esc.urgency}</p>
              <hr>
              <h3>Visitor Information</h3>
              <ul>
                <li><strong>Name:</strong> ${conv.visitorName || "Unknown"}</li>
                <li><strong>Email:</strong> ${conv.visitorEmail || "Not provided"}</li>
                <li><strong>Phone:</strong> ${conv.visitorPhone || "Not provided"}</li>
              </ul>
              <hr>
              <h3>Conversation Details</h3>
              <ul>
                <li><strong>Status:</strong> ${conv.status}</li>
                <li><strong>AI Confidence:</strong> ${conv.aiConfidence}%</li>
                <li><strong>Conversion Intent:</strong> ${conv.conversionIntent}</li>
                <li><strong>Estimated Value:</strong> $${
                  conv.estimatedValue ? (conv.estimatedValue / 100).toFixed(0) : "0"
                }</li>
              </ul>
              <p><a href="https://kreativeaiagency.com/admin/ai-conversations" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">View Conversation</a></p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    // Mark notification as sent
    await db
      .update(escalations)
      .set({
        notificationSent: true,
        notificationSentAt: new Date(),
      })
      .where(eq(escalations.id, esc.id));

    return NextResponse.json({
      success: true,
      message: "Notifications sent successfully",
    });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}

