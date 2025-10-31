
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This will use Google Places API
// For now, we'll create a demo version that you can expand
export async function POST(request: Request) {
  try {
    const { location, industries } = await request.json();

    // You'll need to add your Google Places API key to .env
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "Google Places API key not configured. Add GOOGLE_PLACES_API_KEY to your .env file"
      });
    }

    let allLeads: any[] = [];

    // Search for each industry
    for (const industry of industries) {
      try {
        // Google Places Text Search API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
          `query=${encodeURIComponent(industry + " " + location)}` +
          `&key=${apiKey}`
        );

        const data = await response.json();

        if (data.status === "OK" && data.results) {
          for (const place of data.results) {
            // Get detailed info
            const detailsResponse = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?` +
              `place_id=${place.place_id}` +
              `&fields=name,formatted_phone_number,website,formatted_address,geometry,rating,user_ratings_total,types` +
              `&key=${apiKey}`
            );

            const details = await detailsResponse.json();

            if (details.status === "OK" && details.result) {
              const result = details.result;
              
              // Calculate lead score
              const score = calculateLeadScore({
                hasWebsite: !!result.website,
                reviews: result.user_ratings_total || 0,
                rating: result.rating || 0,
                industry: industry
              });

              // Check if lead already exists
              const existingLead = await prisma.scrapedLead.findFirst({
                where: {
                  OR: [
                    { googlePlaceId: place.place_id },
                    { businessName: result.name, phone: result.formatted_phone_number }
                  ]
                }
              });

              if (!existingLead) {
                const addressParts = result.formatted_address?.split(",") || [];
                const state = addressParts[addressParts.length - 2]?.trim().split(" ")[0] || "NC";
                const city = addressParts[addressParts.length - 3]?.trim() || location.split(",")[0];

                const lead = await prisma.scrapedLead.create({
                  data: {
                    businessName: result.name,
                    industry: industry,
                    phone: result.formatted_phone_number || null,
                    websiteUrl: result.website || null,
                    address: result.formatted_address || null,
                    city: city,
                    state: state,
                    latitude: result.geometry?.location?.lat || null,
                    longitude: result.geometry?.location?.lng || null,
                    foundOnGoogle: true,
                    googlePlaceId: place.place_id,
                    googleRating: result.rating || null,
                    googleReviewsCount: result.user_ratings_total || null,
                    leadScore: score,
                    leadCategory: categorizeLead(score),
                    hasWebsite: !!result.website,
                    status: "NEW"
                  }
                });

                allLeads.push(lead);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error scraping ${industry}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      leadsFound: allLeads.length,
      leads: allLeads
    });

  } catch (error) {
    console.error("Google scraping error:", error);
    return NextResponse.json(
      { success: false, error: "Scraping failed" },
      { status: 500 }
    );
  }
}

function calculateLeadScore(data: {
  hasWebsite: boolean;
  reviews: number;
  rating: number;
  industry: string;
}) {
  let score = 0;

  // Website quality
  if (!data.hasWebsite) score += 30;
  else if (data.reviews < 20) score += 15;

  // Business activity
  if (data.reviews < 20) score += 10;
  if (data.rating < 4.0) score += 5;

  // Industry fit
  const highValueIndustries = [
    "contractor", "real_estate", "plumber", "electrician",
    "hvac", "roofing", "lawyer", "dentist"
  ];
  if (highValueIndustries.some(ind => data.industry.includes(ind))) {
    score += 20;
  }

  return Math.min(score, 100);
}

function categorizeLead(score: number): string {
  if (score >= 80) return "HOT";
  if (score >= 60) return "WARM";
  if (score >= 40) return "COLD";
  return "UNQUALIFIED";
}
