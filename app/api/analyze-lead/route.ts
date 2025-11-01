
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { leadId } = await request.json();

    const lead = await prisma.scrapedLead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    // Analyze website if it exists
    let websiteScore: number | null = null;
    let websiteIssues: string[] = [];
    let mobileFriendly: boolean | null = null;
    let pageSpeedScore: number | null = null;

    if (lead.websiteUrl) {
      try {
        // Check if website is accessible
        const response = await fetch(lead.websiteUrl, { 
          method: "HEAD",
          signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
          websiteScore = 50; // Base score for having an accessible website
          
          // Check mobile viewport
          const htmlResponse = await fetch(lead.websiteUrl);
          const html = await htmlResponse.text();
          
          mobileFriendly = html.includes('viewport');
          if (!mobileFriendly) {
            websiteIssues.push("Not mobile-friendly");
            websiteScore -= 10;
          }

          // Check for common issues
          if (!html.includes('</title>')) {
            websiteIssues.push("Missing page title");
            websiteScore -= 5;
          }

          if (!html.includes('og:')) {
            websiteIssues.push("No social media meta tags");
            websiteScore -= 5;
          }

          // Check page speed (simplified)
          const startTime = Date.now();
          await fetch(lead.websiteUrl);
          const loadTime = Date.now() - startTime;
          
          pageSpeedScore = Math.max(0, 100 - (loadTime / 50));
          
          if (loadTime > 3000) {
            websiteIssues.push("Slow page load time");
            websiteScore -= 10;
          }

        } else {
          websiteScore = 20;
          websiteIssues.push("Website not accessible");
        }
      } catch (error) {
        websiteScore = 10;
        websiteIssues.push("Website error or timeout");
      }
    } else {
      websiteIssues.push("No website found");
    }

    // Recalculate lead score with website data
    let newScore = lead.leadScore;
    if (!lead.websiteUrl) newScore += 20; // No website is actually a good thing for us!
    else if (websiteScore && websiteScore < 50) newScore += 15; // Poor website = opportunity

    // Update lead with analysis
    const updatedLead = await prisma.scrapedLead.update({
      where: { id: leadId },
      data: {
        websiteScore,
        websiteIssues,
        mobileFriendly,
        pageSpeedScore,
        leadScore: newScore,
        leadCategory: categorizeLead(newScore)
      }
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      analysis: {
        websiteScore,
        websiteIssues,
        mobileFriendly,
        pageSpeedScore
      }
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Analysis failed" },
      { status: 500 }
    );
  }
}

function categorizeLead(score: number): string {
  if (score >= 80) return "HOT";
  if (score >= 60) return "WARM";
  if (score >= 40) return "COLD";
  return "UNQUALIFIED";
}
