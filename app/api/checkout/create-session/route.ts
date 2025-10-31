
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      businessName,
      packageId,
      projectType,
      timeline,
      budget,
      description,
      goals,
      targetAudience,
      features,
      upsells,
      additionalNotes,
      referralSource,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !businessName || !budget) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create or update lead in database
    const [lead] = await db
      .insert(leads)
      .values({
        name,
        email,
        phone,
        businessName,
        projectType: projectType || "website",
        budget: budget.toString(),
        timeline: timeline || "flexible",
        notes: description || "",
        source: referralSource || "website",
        status: "pending_payment",
        score: 85, // High score since they're ready to pay
        metadata: {
          goals,
          targetAudience,
          features,
          upsells: upsells || [],
          additionalNotes,
          packageId,
        },
      })
      .onConflictDoUpdate({
        target: leads.email,
        set: {
          name,
          phone,
          businessName,
          projectType: projectType || "website",
          budget: budget.toString(),
          timeline: timeline || "flexible",
          notes: description || "",
          status: "pending_payment",
        },
      })
      .returning();

    // Define upsell pricing map
    const upsellPricing: { [key: string]: { name: string; price: number } } = {
      seo_package: { name: "Advanced SEO Package", price: 750 },
      ai_automation: { name: "AI Chatbot + Phone System", price: 500 },
      social_media: { name: "Social Media Management (3 months)", price: 750 },
      blog_content: { name: "SEO Blog Content Package", price: 500 },
      email_marketing: { name: "Email Marketing Setup", price: 300 },
      priority_support: { name: "Priority Support (6 months)", price: 300 },
    };

    // Build line items array
    const lineItems: any[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${businessName} - ${getPackageDisplayName(packageId)}`,
            description: `Professional ${projectType} development for ${businessName}`,
          },
          unit_amount: parseInt(budget) * 100, // Convert to cents
        },
        quantity: 1,
      },
    ];

    // Add upsells as line items
    if (upsells && Array.isArray(upsells)) {
      upsells.forEach((upsellId: string) => {
        const upsell = upsellPricing[upsellId];
        if (upsell) {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: upsell.name,
                description: `Add-on service for ${businessName}`,
              },
              unit_amount: upsell.price * 100, // Convert to cents
            },
            quantity: 1,
          });
        }
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      customer_email: email,
      metadata: {
        leadId: lead.id.toString(),
        name,
        email,
        phone,
        businessName,
        packageId,
        projectType,
        upsells: upsells ? JSON.stringify(upsells) : "[]",
      },
      billing_address_collection: "required",
    });

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

function getPackageDisplayName(packageId: string): string {
  if (!packageId) return "Custom Package";
  
  const parts = packageId.split("_");
  const type = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1) || "Custom";
  const tier = parts[1]?.charAt(0).toUpperCase() + parts[1]?.slice(1) || "Package";
  
  return `${type} ${tier} Package`;
}
