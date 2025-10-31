
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { sendEmail, sendLeadNotificationEmail } from "@/lib/email";
import { sendSMS } from "@/lib/openphone";

// Calculate lead score based on provided information
function calculateLeadScore(data: {
  budget: string;
  timeline: string;
  challenge?: string;
  goals?: string;
  businessName?: string;
}): number {
  let score = 0;

  // Budget scoring (0-50 points)
  const budgetValue = parseInt(data.budget.replace(/[^0-9]/g, "")) || 0;
  if (budgetValue >= 10000) {
    score += 50; // $10K+ = Maximum points
  } else if (budgetValue >= 5000) {
    score += 40; // $5K-$10K = High value
  } else if (budgetValue >= 2500) {
    score += 30; // $2.5K-$5K = Medium-high value
  } else if (budgetValue >= 1000) {
    score += 20; // $1K-$2.5K = Medium value
  } else if (budgetValue >= 500) {
    score += 10; // $500-$1K = Low-medium value
  } else {
    score += 5; // Not sure / exploring
  }

  // Timeline urgency (0-30 points)
  if (data.timeline === "asap") {
    score += 30; // ASAP = Maximum urgency
  } else if (data.timeline === "1-month") {
    score += 20; // 1 month = High urgency
  } else if (data.timeline === "2-3-months") {
    score += 10; // 2-3 months = Medium urgency
  } else if (data.timeline === "3-6-months") {
    score += 5; // 3-6 months = Lower urgency
  } else {
    score += 2; // Flexible / exploring
  }

  // Detailed information provided (0-20 points)
  if (data.challenge && data.challenge.length > 20) {
    score += 10; // Detailed challenge description
  }
  if (data.goals && data.goals.length > 20) {
    score += 10; // Clear goals defined
  }

  // Business context (0-10 points)
  if (data.businessName && data.businessName.length > 3) {
    score += 10; // Has business name (more serious)
  }

  return Math.min(score, 100); // Cap at 100
}

// Generate AI-powered personalized response
function generateAIResponse(data: {
  name: string;
  projectType: string;
  budget: string;
  timeline: string;
  businessName?: string;
  challenge?: string;
  goals?: string;
}): string {
  const firstName = data.name.split(" ")[0];
  const budgetValue = parseInt(data.budget.replace(/[^0-9]/g, "")) || 0;
  const isHighValue = budgetValue >= 2500;

  let response = `Hey ${firstName}! 👋\n\n`;
  response += `Thanks for reaching out about your ${data.projectType} project`;
  
  if (data.businessName) {
    response += ` for ${data.businessName}`;
  }
  
  response += `. I'm Joey from Kreative Intelligence, and I'm personally handling your request.\n\n`;

  // Personalize based on project type
  if (data.projectType.includes("website") || data.projectType.includes("redesign")) {
    response += `I love working on ${data.projectType} projects! A well-designed website can be a game-changer for your business.\n\n`;
  } else if (data.projectType.includes("ecommerce")) {
    response += `E-commerce is my jam! There's nothing better than seeing online sales roll in from a store we built together.\n\n`;
  } else if (data.projectType.includes("automation") || data.projectType.includes("app")) {
    response += `${data.projectType} is where the magic happens! I love building smart solutions that save time and money.\n\n`;
  }

  // Address their challenge if provided
  if (data.challenge) {
    response += `I read your note about "${data.challenge.substring(0, 80)}..." and I have some great ideas on how we can solve that.\n\n`;
  }

  // Timeline response
  if (data.timeline === "asap") {
    response += `I see you need this ASAP. Good news - we can definitely fast-track this for you! ⚡\n\n`;
  } else if (data.timeline === "1-month") {
    response += `A 1-month timeline is perfect. We can get you launched quickly and properly.\n\n`;
  }

  // Budget-based next steps
  if (isHighValue) {
    response += `Based on your budget of ${data.budget}, I'm clearing my calendar to give your project my full attention. Can we jump on a quick call today or tomorrow? I'll prepare a detailed proposal and we can discuss your vision.\n\n`;
    response += `I'll call you at the number you provided within the next hour. If that doesn't work, reply with a better time!\n\n`;
  } else {
    response += `For your budget range (${data.budget}), I have a few package options that could work perfectly. I'll put together a custom quote and send it over within 24 hours.\n\n`;
    response += `In the meantime, feel free to check out our portfolio at kreativeaiagency.com/portfolio to see similar projects we've done.\n\n`;
  }

  response += `Looking forward to working with you!\n\n`;
  response += `Best,\nJoey`;

  return response;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      businessName,
      businessType,
      projectType,
      budget,
      timeline,
      challenge,
      goals,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !projectType || !budget || !timeline) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate lead score
    const score = calculateLeadScore({
      budget,
      timeline,
      challenge,
      goals,
      businessName,
    });

    // Save to database
    const [lead] = await db
      .insert(leads)
      .values({
        name,
        email,
        phone,
        businessName: businessName || null,
        projectType,
        budget,
        timeline: timeline || null,
        notes: [
          challenge ? `Challenge: ${challenge}` : "",
          goals ? `Goals: ${goals}` : "",
          businessType ? `Business Type: ${businessType}` : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        source: "custom-quote-form",
        status: "new",
        score,
      })
      .returning();

    console.log("✅ Lead saved to database:", lead.id, "Score:", score);

    // Send notification email to Joey
    await sendLeadNotificationEmail({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      businessName: lead.businessName,
      projectType: lead.projectType,
      budget: lead.budget,
      timeline: lead.timeline,
      source: "custom-quote-form",
      score,
    });

    console.log("✅ Notification email sent to Joey");

    // Generate personalized AI response
    const aiResponse = generateAIResponse({
      name,
      projectType,
      budget,
      timeline,
      businessName,
      challenge,
      goals,
    });

    // Send initial email to lead
    await sendEmail({
      to: email,
      subject: `Hey ${name.split(" ")[0]}! Let's talk about your ${projectType} project`,
      html: aiResponse.replace(/\n/g, "<br>"),
    });

    console.log("✅ Initial AI response email sent to lead");

    // Send SMS to lead (if OpenPhone is working)
    try {
      const smsMessage = `Hey ${name.split(" ")[0]}! This is Joey from Kreative Intelligence. Just got your ${projectType} project request. Check your email for details - I'll call you soon! 📞`;
      
      await sendSMS(phone, smsMessage);
      console.log("✅ SMS sent to lead");
    } catch (smsError) {
      console.error("⚠️ SMS failed (payment issue?):", smsError);
      // Don't fail the whole request if SMS fails
    }

    // If high-value lead, send SMS alert to Joey
    const budgetValue = parseInt(budget.replace(/[^0-9]/g, "")) || 0;
    if (budgetValue >= 2500 && process.env.OWNER_PHONE_NUMBER) {
      try {
        const alertMessage = `🔥 HIGH-VALUE LEAD ALERT!\n\nName: ${name}\nBudget: ${budget}\nTimeline: ${timeline}\n\nCall them NOW: ${phone}\n\nView: kreativeaiagency.com/admin/leads`;
        
        await sendSMS(process.env.OWNER_PHONE_NUMBER, alertMessage);
        console.log("✅ High-value alert SMS sent to Joey");
      } catch (alertError) {
        console.error("⚠️ Alert SMS failed:", alertError);
      }
    }

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        score,
      },
    });
  } catch (error: any) {
    console.error("❌ Error processing quote request:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
