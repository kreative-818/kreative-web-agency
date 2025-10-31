
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      metadata: session.metadata,
    });
  } catch (error: any) {
    console.error("Error retrieving session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
