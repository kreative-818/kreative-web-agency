
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { onboardingForms } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const businessDescription = formData.get("businessDescription") as string;
    const targetAudience = formData.get("targetAudience") as string;
    const brandColors = formData.get("brandColors") as string;
    const competitorWebsites = formData.get("competitorWebsites") as string;
    const servicesOffered = formData.get("servicesOffered") as string;
    const specialRequests = formData.get("specialRequests") as string;
    const logoFile = formData.get("logoFile") as File | null;

    // Validate required fields
    if (!businessDescription || !targetAudience || !servicesOffered) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Handle file upload to cloud storage if logoFile exists
    let logoUrl = null;
    if (logoFile) {
      // For now, just store the filename
      // In production, you'd upload to S3 or similar
      logoUrl = logoFile.name;
    }

    // Insert into database
    await db.insert(onboardingForms).values({
      businessDescription,
      targetAudience,
      brandColors: brandColors || null,
      competitorWebsites: competitorWebsites || null,
      servicesOffered,
      specialRequests: specialRequests || null,
      logoUrl: logoUrl || null,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process onboarding" },
      { status: 500 }
    );
  }
}
