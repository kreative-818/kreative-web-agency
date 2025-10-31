
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { callLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const logs = await db
      .select()
      .from(callLogs)
      .orderBy(desc(callLogs.createdAt))
      .limit(100);

    return NextResponse.json({
      success: true,
      callLogs: logs,
    });
  } catch (error) {
    console.error("Error fetching call logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch call logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newLog = await db
      .insert(callLogs)
      .values(body)
      .returning();

    return NextResponse.json({
      success: true,
      callLog: newLog[0],
    });
  } catch (error) {
    console.error("Error creating call log:", error);
    return NextResponse.json(
      { error: "Failed to create call log" },
      { status: 500 }
    );
  }
}
