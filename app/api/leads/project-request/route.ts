
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Save to database
    await db.insert(leads).values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      businessName: data.businessName,
      projectType: data.projectType || "website",
      budget: data.budget || "TBD",
      timeline: data.timeline,
      status: "new",
      source: "website_form",
      notes: data.description,
      metadata: {
        packageId: data.packageId,
        goals: data.goals,
        targetAudience: data.targetAudience,
        features: data.features,
        upsells: data.upsells,
        billingPeriod: data.billingPeriod,
        retainerPrice: data.retainerPrice,
        referralSource: data.referralSource,
        additionalNotes: data.additionalNotes,
      },
    });

    // Send email notification
    const emailHtml = `
      <h2>New Project Request</h2>
      <h3>Contact Information</h3>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
        <li><strong>Business:</strong> ${data.businessName}</li>
      </ul>
      
      <h3>Project Details</h3>
      <ul>
        <li><strong>Package:</strong> ${data.packageId || "Custom"}</li>
        <li><strong>Budget:</strong> $${data.budget || "TBD"}</li>
        <li><strong>Timeline:</strong> ${data.timeline || "Not specified"}</li>
      </ul>
      
      <h3>Project Description</h3>
      <p>${data.description || "Not provided"}</p>
      
      <h3>Goals</h3>
      <p>${data.goals || "Not provided"}</p>
      
      <h3>Target Audience</h3>
      <p>${data.targetAudience || "Not provided"}</p>
      
      ${data.features && data.features.length > 0 ? `
      <h3>Requested Features</h3>
      <ul>
        ${data.features.map((f: string) => `<li>${f}</li>`).join("")}
      </ul>
      ` : ""}
      
      ${data.upsells && data.upsells.length > 0 ? `
      <h3>Selected Add-Ons</h3>
      <ul>
        ${data.upsells.map((u: string) => `<li>${u}</li>`).join("")}
      </ul>
      ` : ""}
      
      ${data.additionalNotes ? `
      <h3>Additional Notes</h3>
      <p>${data.additionalNotes}</p>
      ` : ""}
      
      <p><strong>Referral Source:</strong> ${data.referralSource || "Not specified"}</p>
    `;

    await resend.emails.send({
      from: "Kreative Intelligence <noreply@kreativeaiagency.com>",
      to: "contact@kreativehq.com",
      subject: `New Project Request from ${data.name}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project request error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
