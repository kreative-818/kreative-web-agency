
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { callLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = parseInt(params.id);

    const logs = await db
      .select()
      .from(callLogs)
      .where(eq(callLogs.leadId, leadId))
      .orderBy(desc(callLogs.createdAt));

    return NextResponse.json({ callLogs: logs });
  } catch (error) {
    console.error("Error fetching call logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
