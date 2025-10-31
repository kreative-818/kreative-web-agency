
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

/**
 * Admin-only endpoint to create custom Stripe checkout sessions
 * with special pricing for specific clients
 * 
 * This allows you to:
 * 1. Create custom packages not listed on the website
 * 2. Offer special discounts to specific clients
 * 3. Bundle services at custom rates
 * 4. Create payment plans for enterprise clients
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      packageName,
      customAmount,
      customerEmail,
      customerName,
      description,
      paymentPlanType = "full", // "full" | "deposit" | "installments"
      installmentCount,
      metadata = {},
    } = body;

    // Validate required fields
    if (!packageName || !customAmount || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields: packageName, customAmount, customerEmail" },
        { status: 400 }
      );
    }

    // Handle different payment plan types
    let checkoutSession;

    if (paymentPlanType === "full") {
      // Single payment
      checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: packageName,
                description: description || `Custom ${packageName} Package`,
              },
              unit_amount: Math.round(customAmount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kreativeaiagency.com'}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kreativeaiagency.com'}/pricing`,
        customer_email: customerEmail,
        metadata: {
          packageType: "custom",
          packageName,
          customAmount,
          customerName: customerName || "",
          createdBy: session.user.email || "",
          paymentPlanType: "full",
          ...metadata,
        },
      });
    } else if (paymentPlanType === "deposit") {
      // 50% deposit, 50% later
      const depositAmount = customAmount / 2;
      
      checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${packageName} - Deposit (50%)`,
                description: `${description || 'Custom package'} - 50% deposit. Balance of $${depositAmount.toFixed(2)} due on completion.`,
              },
              unit_amount: Math.round(depositAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kreativeaiagency.com'}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kreativeaiagency.com'}/pricing`,
        customer_email: customerEmail,
        metadata: {
          packageType: "custom",
          packageName,
          customAmount,
          customerName: customerName || "",
          createdBy: session.user.email || "",
          paymentPlanType: "deposit",
          depositAmount,
          remainingAmount: depositAmount,
          ...metadata,
        },
      });
    } else if (paymentPlanType === "installments" && installmentCount) {
      // Monthly installments
      const monthlyAmount = customAmount / installmentCount;
      
      // Create a Stripe product and price for subscription
      const product = await stripe.products.create({
        name: packageName,
        description: description || `Custom ${packageName} Package - ${installmentCount} monthly payments`,
        metadata: {
          packageType: "custom",
          totalAmount: customAmount.toString(),
          installmentCount: installmentCount.toString(),
        },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(monthlyAmount * 100),
        currency: "usd",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
        metadata: {
          totalInstallments: installmentCount.toString(),
          totalAmount: customAmount.toString(),
        },
      });

      checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kreativeaiagency.com'}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://kreativeaiagency.com'}/pricing`,
        customer_email: customerEmail,
        subscription_data: {
          metadata: {
            packageType: "custom",
            packageName,
            totalAmount: customAmount.toString(),
            installmentCount: installmentCount.toString(),
            createdBy: session.user.email || "",
            ...metadata,
          },
        },
        metadata: {
          packageType: "custom",
          packageName,
          customAmount: customAmount.toString(),
          customerName: customerName || "",
          createdBy: session.user.email || "",
          paymentPlanType: "installments",
          installmentCount: installmentCount.toString(),
          ...metadata,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid payment plan type or missing installment count" },
        { status: 400 }
      );
    }

    // Log the custom checkout creation
    console.log("✅ Custom checkout session created:", {
      sessionId: checkoutSession.id,
      packageName,
      amount: customAmount,
      customer: customerEmail,
      paymentPlanType,
    });

    // Return the checkout URL
    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
      amount: customAmount,
      paymentPlanType,
      message: "Custom checkout session created successfully",
    });

  } catch (error: any) {
    console.error("❌ Error creating custom checkout:", error);
    return NextResponse.json(
      { 
        error: "Failed to create custom checkout session",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve custom checkout history
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Fetch recent custom checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 50,
    });

    // Filter for custom packages
    const customSessions = sessions.data
      .filter(s => s.metadata?.packageType === "custom")
      .map(s => ({
        id: s.id,
        packageName: s.metadata?.packageName,
        amount: s.metadata?.customAmount,
        customerEmail: s.customer_email,
        customerName: s.metadata?.customerName,
        status: s.payment_status,
        paymentPlanType: s.metadata?.paymentPlanType,
        createdAt: new Date(s.created * 1000).toISOString(),
        url: s.url,
      }));

    return NextResponse.json({
      success: true,
      sessions: customSessions,
    });

  } catch (error: any) {
    console.error("❌ Error fetching custom checkouts:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch custom checkout sessions",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
