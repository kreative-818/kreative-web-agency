
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leads = await prisma.scrapedLead.findMany({
      orderBy: [
        { leadScore: "desc" },
        { discoveredAt: "desc" }
      ]
    });

    // Calculate stats
    const stats = {
      total: leads.length,
      hot: leads.filter(l => l.leadCategory === "HOT").length,
      warm: leads.filter(l => l.leadCategory === "WARM").length,
      cold: leads.filter(l => l.leadCategory === "COLD").length,
      contacted: leads.filter(l => l.status === "CONTACTED" || l.contactAttempts > 0).length,
      interested: leads.filter(l => l.interestedInService).length,
      converted: leads.filter(l => l.status === "CONVERTED").length
    };

    return NextResponse.json({ leads, stats });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const lead = await prisma.scrapedLead.create({
      data: body
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
