
import { NextResponse } from "next/server";
import { createAutomatedAdCampaign, getCampaignPerformance, getAdLeads } from "@/lib/facebook-automation";

/**
 * CREATE OR MANAGE FACEBOOK AD CAMPAIGNS
 * 
 * POST /api/facebook-ads
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "create_campaign") {
      // Create automated ad campaign
      const result = await createAutomatedAdCampaign({
        campaignName: body.campaignName || "Kreative Intelligence - Website Services",
        objective: body.objective || "LEAD_GENERATION",
        dailyBudget: body.dailyBudget || 5000, // $50/day in cents
        targeting: {
          locations: body.locations || ["US"],
          ageMin: body.ageMin || 25,
          ageMax: body.ageMax || 65,
          interests: body.interests || [
            "Small business",
            "Entrepreneurship",
            "Web design",
            "Digital marketing",
          ],
        },
        adCreative: {
          headline: body.headline || "Professional Website Design - $997",
          description: body.description || "Get a custom, mobile-responsive website built by experts. Fast turnaround, no templates. Book your free consultation today!",
          imageUrl: body.imageUrl || "https://kreativeaiagency.com/portfolio/kreative-web-agency.jpg",
          callToAction: body.callToAction || "LEARN_MORE",
          destinationUrl: body.destinationUrl || "https://kreativeaiagency.com/get-quote",
        },
        leadFormId: body.leadFormId,
      });

      return NextResponse.json({
        success: true,
        result,
        message: "Campaign created successfully and is now running",
      });
    }

    if (action === "get_performance") {
      // Get campaign performance metrics
      const performance = await getCampaignPerformance(body.campaignId);

      return NextResponse.json({
        success: true,
        performance,
      });
    }

    if (action === "get_leads") {
      // Get leads from lead form
      const leads = await getAdLeads(body.leadFormId);

      return NextResponse.json({
        success: true,
        leads,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Facebook ads error:", error);
    return NextResponse.json(
      {
        error: "Failed to process Facebook ads request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET CAMPAIGN STATUS
 * 
 * GET /api/facebook-ads?campaignId=123
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const performance = await getCampaignPerformance(campaignId);

    return NextResponse.json({
      success: true,
      performance,
    });
  } catch (error: any) {
    console.error("Failed to get campaign status:", error);
    return NextResponse.json(
      {
        error: "Failed to get campaign status",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
