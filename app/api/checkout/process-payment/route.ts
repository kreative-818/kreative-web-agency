
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { leads, projects, clientPortalUsers, clients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendOpenPhoneSMS } from "@/lib/openphone";
import bcrypt from "bcryptjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session ID" },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const metadata = session.metadata;
    const leadId = metadata?.leadId ? parseInt(metadata.leadId) : null;

    if (!leadId) {
      return NextResponse.json(
        { error: "Invalid lead ID" },
        { status: 400 }
      );
    }

    // Update lead status to "paid"
    const [updatedLead] = await db
      .update(leads)
      .set({
        status: "qualified",
        score: 100,
        metadata: {
          stripeSessionId: sessionId,
          paymentStatus: "paid",
          paidAt: new Date().toISOString(),
        },
      })
      .where(eq(leads.id, leadId))
      .returning();

    // Generate portal credentials
    const portalPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(portalPassword, 10);

    // Create client account first
    const [client] = await db
      .insert(clients)
      .values({
        fullName: metadata?.name || updatedLead.name,
        email: metadata?.email || updatedLead.email!,
        phone: metadata?.phone || updatedLead.phone,
        businessName: metadata?.businessName || updatedLead.businessName,
        stripeCustomerId: session.customer as string || null,
        status: "active",
      })
      .onConflictDoUpdate({
        target: clients.email,
        set: {
          fullName: metadata?.name || updatedLead.name,
          phone: metadata?.phone || updatedLead.phone,
          businessName: metadata?.businessName || updatedLead.businessName,
        },
      })
      .returning();

    // Create portal user account
    const [portalUser] = await db
      .insert(clientPortalUsers)
      .values({
        clientId: client.id,
        email: metadata?.email || updatedLead.email!,
        password: hashedPassword,
        fullName: metadata?.name || updatedLead.name,
        phone: metadata?.phone || updatedLead.phone,
        role: "client",
      })
      .onConflictDoUpdate({
        target: clientPortalUsers.email,
        set: {
          fullName: metadata?.name || updatedLead.name,
        },
      })
      .returning();

    // Create project record
    const [project] = await db
      .insert(projects)
      .values({
        clientId: client.id,
        title: `${metadata?.businessName || updatedLead.businessName} - ${metadata?.packageId || "Project"}`,
        description: updatedLead.notes || "New project",
        projectType: metadata?.projectType || updatedLead.projectType || "website",
        status: "not_started",
        progress: 0,
        startDate: new Date(),
        budget: session.amount_total || 0,
        metadata: {
          packageId: metadata?.packageId,
          stripeSessionId: sessionId,
          features: (updatedLead.metadata as any)?.features || [],
          leadId: leadId,
        },
      })
      .returning();

    // Send SMS confirmation
    try {
      await sendOpenPhoneSMS({
        to: metadata?.phone || updatedLead.phone || "",
        message: `🎉 Welcome to Kreative Intelligence! Your project "${project.title}" is confirmed. We'll be in touch within 24 hours to schedule your kickoff meeting. Check your email for portal access!`,
      });
    } catch (smsError) {
      console.error("SMS sending error:", smsError);
      // Continue anyway
    }

    // Send welcome email (you'll need to implement this with your email service)
    try {
      await sendWelcomeEmail({
        to: metadata?.email || updatedLead.email || "",
        name: metadata?.name || updatedLead.name,
        businessName: metadata?.businessName || updatedLead.businessName || "",
        portalEmail: metadata?.email || updatedLead.email || "",
        portalPassword: portalPassword,
        projectName: project.title,
        amount: (session.amount_total || 0) / 100,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue anyway
    }

    // Send owner notification
    try {
      const ownerPhone = process.env.OWNER_PHONE_NUMBER;
      if (ownerPhone) {
        await sendOpenPhoneSMS({
          to: ownerPhone,
          message: `💰 NEW PAID PROJECT!

${metadata?.name} | ${metadata?.businessName}
📞 ${metadata?.phone}
📧 ${metadata?.email}

Package: ${metadata?.packageId}
Amount: $${((session.amount_total || 0) / 100).toLocaleString()}

Project created in dashboard. Contact within 24 hours!`,
        });
      }
    } catch (notifyError) {
      console.error("Owner notification error:", notifyError);
      // Continue anyway
    }

    return NextResponse.json({
      success: true,
      email: metadata?.email || updatedLead.email,
      phone: metadata?.phone || updatedLead.phone,
      businessName: metadata?.businessName || updatedLead.businessName,
      packageName: metadata?.packageId || "Custom Package",
      amount: (session.amount_total || 0) / 100,
      timeline: updatedLead.timeline,
      portalUrl: "/portal/login",
      projectId: project.id,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

function generateRandomPassword(length = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

async function sendWelcomeEmail(params: {
  to: string;
  name: string;
  businessName: string;
  portalEmail: string;
  portalPassword: string;
  projectName: string;
  amount: number;
}) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Kreative Intelligence <noreply@kreativeaiagency.com>",
      to: params.to,
      subject: `🎉 Welcome to Kreative Intelligence - ${params.projectName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Welcome to Kreative Intelligence</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to Kreative Intelligence! 🎉</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #667eea;">Hi ${params.name},</h2>
            
            <p>Thank you for choosing Kreative Intelligence! We're thrilled to start building <strong>${params.projectName}</strong> for ${params.businessName}.</p>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">Your Project Details</h3>
              <p><strong>Project:</strong> ${params.projectName}</p>
              <p><strong>Investment:</strong> $${params.amount.toLocaleString()}</p>
              <p><strong>Status:</strong> Planning Phase</p>
            </div>
            
            <h3 style="color: #667eea;">Your Client Portal Access</h3>
            <p>We've created a dedicated portal where you can track your project progress, communicate with our team, and access important documents.</p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Portal URL:</strong> https://kreativeaiagency.com/portal/login</p>
              <p><strong>Email:</strong> ${params.portalEmail}</p>
              <p><strong>Temporary Password:</strong> <code style="background: #f1f1f1; padding: 5px 10px; border-radius: 3px;">${params.portalPassword}</code></p>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">⚠️ Please change your password after first login</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://kreativeaiagency.com/portal/login" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Access Portal Now</a>
            </div>
            
            <h3 style="color: #667eea;">What Happens Next?</h3>
            <ol style="padding-left: 20px;">
              <li><strong>Within 24 hours:</strong> We'll contact you to schedule your project kickoff meeting</li>
              <li><strong>Kickoff Meeting:</strong> We'll review your requirements, timeline, and answer any questions</li>
              <li><strong>Design Phase:</strong> You'll receive initial mockups for feedback</li>
              <li><strong>Development:</strong> We'll build your project with regular updates via the portal</li>
              <li><strong>Launch:</strong> Final review, training, and go-live!</li>
            </ol>
            
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <h4 style="margin-top: 0; color: #667eea;">Need Help?</h4>
              <p style="margin: 10px 0;">Call or text us anytime:</p>
              <p style="font-size: 20px; font-weight: bold; color: #667eea; margin: 10px 0;">(704) 806-8682</p>
              <p style="font-size: 14px; color: #666;">Email: support@kreativewebagency.com</p>
            </div>
            
            <p>We're excited to work with you and can't wait to bring your vision to life!</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The Kreative Intelligence Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
            <p>Kreative Intelligence | Charlotte, NC</p>
            <p>This email was sent to ${params.to}</p>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Welcome email error:", error);
    throw error;
  }
}
