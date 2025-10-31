
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { purchases } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      fullName,
      email,
      phone,
      businessName,
      businessType,
      basePrice,
      upgradesTotal,
      finalTotal,
      upgrades
    } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !businessType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into database
    const [purchase] = await db.insert(purchases).values({
      fullName,
      email,
      phone,
      businessName: businessName || null,
      businessType,
      basePrice,
      upgradesTotal: upgradesTotal || 0,
      finalTotal,
      upgrades: JSON.stringify(upgrades || []),
      status: "pending",
      createdAt: new Date()
    }).returning();

    // Send email notification to you
    const upgradesList = upgrades && upgrades.length > 0
      ? upgrades.map((u: any) => `${u.name}: $${u.price}`).join('\n')
      : 'None';

    try {
      await sendEmail({
        to: "kreativeintelligencetbcs@gmail.com",
        subject: `🚨 NEW QUOTE REQUEST - $${finalTotal} - ${fullName}`,
        html: `
          <h2>🎉 New Quote Request!</h2>
          <p><strong>Customer wants to spend $${finalTotal}!</strong></p>
          
          <h3>Contact Info:</h3>
          <ul>
            <li><strong>Name:</strong> ${fullName}</li>
            <li><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></li>
            <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
            <li><strong>Business:</strong> ${businessName || 'Not provided'}</li>
            <li><strong>Type:</strong> ${businessType}</li>
          </ul>
          
          <h3>Quote Details:</h3>
          <ul>
            <li><strong>Base Price:</strong> $${basePrice}</li>
            <li><strong>Upgrades Total:</strong> $${upgradesTotal || 0}</li>
            <li><strong>TOTAL:</strong> $${finalTotal}</li>
          </ul>
          
          <h3>Selected Upgrades:</h3>
          <pre>${upgradesList}</pre>
          
          <p><strong>⏰ ACTION REQUIRED:</strong> Call or text them within 5 minutes!</p>
          <p><a href="tel:${phone}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Call ${fullName} Now</a></p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, purchaseId: purchase.id });
  } catch (error) {
    console.error("Purchase submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
