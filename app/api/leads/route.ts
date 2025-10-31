
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle both formats: landing page format and full form format
    const isLandingPageForm = body.name && body.phone && !body.contactName;
    
    let leadData;
    
    if (isLandingPageForm) {
      // Landing page format (simpler)
      const { name, phone, businessType, message, source } = body;
      
      if (!name || !phone) {
        return NextResponse.json(
          { error: "Name and phone are required" },
          { status: 400 }
        );
      }

      leadData = {
        name,
        email: body.email || null,
        phone,
        businessName: body.businessName || name,
        projectType: businessType || "Website",
        budget: "997",
        timeline: "asap",
        source: source || "landing_page",
        score: 80, // High score for landing page leads
        status: "new" as const,
        notes: message || null,
        metadata: { businessType, painPoint: message },
      };
    } else {
      // Full form format
      const {
        businessName,
        businessType,
        currentWebsiteUrl,
        servicesInterested,
        projectTimeline,
        budgetRange,
        contactName,
        contactEmail,
        contactPhone,
        additionalDetails,
      } = body;

      if (!businessName || !businessType || !contactName || !contactEmail || !contactPhone) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Calculate basic lead score
      let score = 50;
      if (budgetRange === "premium") score += 30;
      else if (budgetRange === "pro") score += 20;
      else if (budgetRange === "basic") score += 10;
      
      if (projectTimeline === "asap" || projectTimeline === "1-2-weeks") score += 20;

      leadData = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        businessName,
        projectType: servicesInterested?.join(", ") || businessType,
        budget: budgetRange,
        timeline: projectTimeline,
        source: "form",
        score,
        status: "new" as const,
        notes: additionalDetails || null,
        metadata: {
          businessType,
          currentWebsiteUrl,
          servicesInterested,
        },
      };
    }

    // Create the lead
    const [newLead] = await db.insert(leads).values(leadData).returning();

    // Send email notification
    try {
      await sendEmail({
        to: "kreativeintelligencetbcs@gmail.com",
        subject: `🚨 NEW LEAD - ${leadData.name} - ${leadData.phone}`,
        html: `
          <h2>🎉 New Lead from Landing Page!</h2>
          <p><strong>Priority: HIGH - Call them in the next 5 minutes!</strong></p>
          
          <h3>Contact Info:</h3>
          <ul>
            <li><strong>Name:</strong> ${leadData.name}</li>
            <li><strong>Phone:</strong> <a href="tel:${leadData.phone}">${leadData.phone}</a></li>
            <li><strong>Email:</strong> ${leadData.email || 'Not provided'}</li>
            <li><strong>Business:</strong> ${leadData.businessName}</li>
            <li><strong>Type:</strong> ${leadData.projectType}</li>
          </ul>
          
          <h3>Lead Details:</h3>
          <ul>
            <li><strong>Budget:</strong> $${leadData.budget}</li>
            <li><strong>Timeline:</strong> ${leadData.timeline}</li>
            <li><strong>Source:</strong> ${leadData.source}</li>
            <li><strong>Score:</strong> ${leadData.score}/100</li>
          </ul>
          
          ${leadData.notes ? `
            <h3>Pain Point / Message:</h3>
            <p>${leadData.notes}</p>
          ` : ''}
          
          <p><strong>⏰ ACTION REQUIRED:</strong> Call or text them NOW!</p>
          <p><a href="tel:${leadData.phone}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Call ${leadData.name} Now</a></p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { message: "Lead created successfully", leadId: newLead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
