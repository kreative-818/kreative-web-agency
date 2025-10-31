
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const lead = await prisma.intentLead.update({
      where: { id },
      data: {
        firstContactedAt: new Date(),
        lastContactedAt: new Date(),
        callAttempts: { increment: 1 },
        qualificationStatus: 'CONTACTED'
      }
    });

    return NextResponse.json({
      success: true,
      lead
    });

  } catch (error) {
    console.error("Error updating lead contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
