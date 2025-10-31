
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { leadId } = await request.json();

    const lead = await prisma.scrapedLead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    // Check if we have Twilio credentials
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      return NextResponse.json({
        success: false,
        error: "Twilio credentials not configured. You'll need to add these to enable SMS outreach."
      });
    }

    // Generate personalized message
    const message = generateMessage(lead);

    let smsSent = false;
    let emailSent = false;

    // Send SMS if phone available
    if (lead.phone) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const auth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');

        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: lead.phone,
            From: twilioPhoneNumber,
            Body: message.sms
          })
        });

        if (response.ok) {
          smsSent = true;
        }
      } catch (error) {
        console.error("SMS send error:", error);
      }
    }

    // Send Email if email available (using Resend or SendGrid)
    if (lead.email) {
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (resendApiKey) {
        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Kreative Web Agency <support@kreativewebagency.com>',
              to: [lead.email],
              subject: message.emailSubject,
              html: message.emailBody
            })
          });

          if (response.ok) {
            emailSent = true;
          }
        } catch (error) {
          console.error("Email send error:", error);
        }
      }
    }

    // Update lead status
    const updatedLead = await prisma.scrapedLead.update({
      where: { id: leadId },
      data: {
        status: "CONTACTED",
        firstContactedAt: lead.firstContactedAt || new Date(),
        lastContactedAt: new Date(),
        contactAttempts: lead.contactAttempts + 1
      }
    });

    return NextResponse.json({
      success: true,
      smsSent,
      emailSent,
      lead: updatedLead
    });

  } catch (error) {
    console.error("Outreach error:", error);
    return NextResponse.json(
      { success: false, error: "Outreach failed" },
      { status: 500 }
    );
  }
}

function generateMessage(lead: any) {
  const businessName = lead.businessName;
  const hasWebsite = lead.hasWebsite;

  let sms = "";
  let emailSubject = "";
  let emailBody = "";

  if (!hasWebsite) {
    sms = `Hi ${businessName}! I noticed you don't have a website yet. We build professional sites starting at just $79. Interested? Reply YES for details!`;
    emailSubject = `${businessName} - Missing Out on Online Customers?`;
    emailBody = `
      <h2>Hi ${businessName},</h2>
      <p>I was researching local businesses in ${lead.city} and noticed you don't have a website yet.</p>
      <p>In today's digital world, <strong>93% of customers</strong> search online before making a purchase. Without a website, you're invisible to these potential customers.</p>
      <h3>We Can Help:</h3>
      <ul>
        <li>Professional website design starting at $79</li>
        <li>Mobile-friendly and fast loading</li>
        <li>SEO optimized to rank on Google</li>
        <li>Set up in as little as 7 days</li>
      </ul>
      <p><strong>Limited Time:</strong> First 10 clients get a FREE logo design worth $199!</p>
      <p>Reply to this email or call us at 984-400-9443 to get started.</p>
      <p>Best regards,<br>Kreative Web Agency</p>
    `;
  } else {
    sms = `Hi ${businessName}! Your website could use an upgrade. We specialize in modern redesigns that convert visitors into customers. Reply YES to learn more!`;
    emailSubject = `${businessName} - Time for a Website Refresh?`;
    emailBody = `
      <h2>Hi ${businessName},</h2>
      <p>I was checking out your website and wanted to reach out with some ideas on how we could improve it to attract more customers.</p>
      <p><strong>Quick website analysis:</strong></p>
      <ul>
        ${lead.websiteIssues && lead.websiteIssues.length > 0 
          ? lead.websiteIssues.map((issue: string) => `<li>${issue}</li>`).join('') 
          : '<li>Could benefit from modern design updates</li>'}
      </ul>
      <h3>What We Offer:</h3>
      <ul>
        <li>Modern, mobile-responsive redesigns</li>
        <li>Faster page load speeds = better Google rankings</li>
        <li>Professional design that builds trust</li>
        <li>Affordable pricing starting at $499</li>
      </ul>
      <p>Want to see what we can do? Reply to this email and I'll send you a FREE mockup of how your new site could look.</p>
      <p>Best regards,<br>Kreative Web Agency<br>984-400-9443</p>
    `;
  }

  return { sms, emailSubject, emailBody };
}
