
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = parseInt(params.id);
    const body = await request.json();

    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.score !== undefined) updateData.score = body.score;
    if (body.stage !== undefined) updateData.stage = body.stage;

    const [updatedLead] = await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, leadId))
      .returning();

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support PUT method for compatibility with pipeline
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PATCH(request, { params });
}
