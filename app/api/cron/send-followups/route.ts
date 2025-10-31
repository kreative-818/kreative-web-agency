
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { followUps, leads } from "@/lib/db/schema";
import { and, eq, lte } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Cron job to send scheduled follow-ups
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Get all pending follow-ups that are due
    const dueFollowUps = await db
      .select({
        followUp: followUps,
        lead: leads,
      })
      .from(followUps)
      .innerJoin(leads, eq(followUps.leadId, leads.id))
      .where(
        and(
          eq(followUps.status, "pending"),
          lte(followUps.scheduledFor, now)
        )
      )
      .limit(50); // Process 50 at a time

    let sent = 0;
    let failed = 0;

    for (const { followUp, lead } of dueFollowUps) {
      try {
        // Check if lead has responded - if so, stop all future follow-ups
        if (lead.status === "contacted" || lead.status === "qualified") {
          await stopFollowUpSequence(lead.id);
          continue;
        }

        // Send the follow-up
        if (followUp.channel === "email") {
          await sendFollowUpEmail(followUp, lead);
        } else if (followUp.channel === "sms") {
          await sendFollowUpSMS(followUp, lead);
        }

        // Mark as sent
        await db
          .update(followUps)
          .set({
            status: "sent",
            sentAt: new Date(),
          })
          .where(eq(followUps.id, followUp.id));

        sent++;
      } catch (error) {
        console.error(`Error sending follow-up ${followUp.id}:`, error);
        
        // Mark as failed
        await db
          .update(followUps)
          .set({ status: "failed" })
          .where(eq(followUps.id, followUp.id));
        
        failed++;
      }
    }

    return NextResponse.json({
      message: "Follow-ups processed",
      sent,
      failed,
      total: dueFollowUps.length,
    });
  } catch (error) {
    console.error("Error processing follow-ups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Stop all future follow-ups for a lead
async function stopFollowUpSequence(leadId: number) {
  await db
    .update(followUps)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(followUps.leadId, leadId),
        eq(followUps.status, "pending")
      )
    );
}

// Send follow-up email via Resend
async function sendFollowUpEmail(followUp: any, lead: any) {
  if (!lead.email) {
    throw new Error("Lead has no email address");
  }

  // Personalize content with lead data
  const personalizedContent = personalizeContent(followUp.content, lead);
  const personalizedSubject = personalizeContent(followUp.subject, lead);

  const { sendFollowUpEmail: sendEmail } = await import("@/lib/email");
  await sendEmail(lead.email, personalizedSubject, personalizedContent);
}

// Send follow-up SMS via OpenPhone
async function sendFollowUpSMS(followUp: any, lead: any) {
  if (!lead.phone) {
    throw new Error("Lead has no phone number");
  }

  // Personalize content with lead data
  const personalizedContent = personalizeContent(followUp.content, lead);

  console.log("📱 Sending follow-up SMS:", {
    to: lead.phone,
    sequence: followUp.sequence,
  });

  // Send SMS via OpenPhone
  try {
    const response = await fetch("https://api.openphone.com/v1/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENPHONE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.OPENPHONE_PHONE_NUMBER,
        to: lead.phone,
        content: personalizedContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenPhone API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("SMS sent successfully:", data);
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
}

// Personalize message content with lead data
function personalizeContent(template: string, lead: any): string {
  if (!template) return "";

  return template
    .replace(/{{name}}/g, lead.name || "there")
    .replace(/{{businessName}}/g, lead.businessName || "your business")
    .replace(/{{projectType}}/g, lead.projectType || "project")
    .replace(/{{budget}}/g, lead.budget || "your budget")
    .replace(/{{timeline}}/g, lead.timeline || "your timeline")
    .replace(/{{businessType}}/g, extractBusinessType(lead.projectType))
    .replace(/\[CALENDAR_LINK\]/g, "https://kreativeaiagency.com/get-started")
    .replace(/\[CASE_STUDY_LINK\]/g, "https://kreativeaiagency.com/portfolio")
    .replace(/\[GUIDE_LINK\]/g, "https://kreativeaiagency.com/blog");
}

// Extract business type from project type
function extractBusinessType(projectType: string): string {
  if (!projectType) return "business";
  
  const projectLower = projectType.toLowerCase();
  if (projectLower.includes("restaurant")) return "Restaurant";
  if (projectLower.includes("real estate")) return "Real Estate";
  if (projectLower.includes("ecommerce") || projectLower.includes("store")) return "E-commerce";
  if (projectLower.includes("service")) return "Service Business";
  
  return "Business";
}
