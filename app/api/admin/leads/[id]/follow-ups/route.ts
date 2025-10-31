
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { followUps } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = parseInt(params.id);

    const allFollowUps = await db
      .select()
      .from(followUps)
      .where(eq(followUps.leadId, leadId))
      .orderBy(asc(followUps.sequence));

    return NextResponse.json({ followUps: allFollowUps });
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
