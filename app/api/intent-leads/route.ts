
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const qualified = searchParams.get("qualified");

    let where: any = {};

    if (status) {
      where.qualificationStatus = status;
    }

    if (qualified === "true") {
      where.qualificationStatus = "QUALIFIED";
    }

    const leads = await prisma.intentLead.findMany({
      where,
      orderBy: [
        { leadScore: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculate stats
    const stats = {
      total: leads.length,
      qualified: leads.filter((l: any) => l.qualificationStatus === 'QUALIFIED').length,
      pending: leads.filter((l: any) => l.qualificationStatus === 'PENDING').length,
      contacted: leads.filter((l: any) => l.firstContactedAt !== null).length,
      converted: leads.filter((l: any) => l.qualificationStatus === 'CONVERTED').length,
      averageScore: leads.length > 0 
        ? Math.round(leads.reduce((sum: number, l: any) => sum + l.leadScore, 0) / leads.length)
        : 0,
      averageBudget: leads.length > 0
        ? Math.round(leads.reduce((sum: number, l: any) => sum + (l.budgetAmount || 0), 0) / leads.length)
        : 0
    };

    return NextResponse.json({
      success: true,
      leads,
      stats
    });

  } catch (error) {
    console.error("Error fetching intent leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
