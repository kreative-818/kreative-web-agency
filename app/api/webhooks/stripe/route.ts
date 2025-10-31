
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { clients, subscriptions, clientInvoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { metadata, customer_email, customer } = session;
  
  if (!metadata) return;

  const { packageName, packageType, setupFee, monthlyRate, createSubscription } = metadata;

  // Create or update client
  let client;
  const existingClients = await db
    .select()
    .from(clients)
    .where(eq(clients.email, customer_email || ""))
    .limit(1);

  if (existingClients.length > 0) {
    client = existingClients[0];
    // Update stripe customer ID if needed
    if (customer && client.stripeCustomerId !== customer) {
      await db
        .update(clients)
        .set({ stripeCustomerId: customer as string, updatedAt: new Date() })
        .where(eq(clients.id, client.id));
    }
  } else {
    // Create new client
    const [newClient] = await db
      .insert(clients)
      .values({
        fullName: metadata.customerName || "New Client",
        email: customer_email || "",
        phone: metadata.customerPhone || null,
        businessName: metadata.businessName || null,
        stripeCustomerId: customer as string || null,
        status: "active",
      })
      .returning();
    client = newClient;
  }

  // Create subscription record
  if (createSubscription === "true" && client) {
    await db.insert(subscriptions).values({
      clientId: client.id,
      packageName: packageName || "custom",
      packageType: packageType || "monthly",
      setupFee: parseInt(setupFee || "0"),
      monthlyRate: parseInt(monthlyRate || "0"),
      stripeCheckoutSessionId: session.id,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      services: [],
      metadata: {},
    });
  }

  // Record the payment
  if (session.amount_total && client) {
    await db.insert(clientInvoices).values({
      clientId: client.id,
      stripeInvoiceId: session.invoice as string || null,
      stripePaymentIntentId: session.payment_intent as string || null,
      amount: session.amount_total,
      description: `${packageName} Package - Setup Fee`,
      status: "paid",
      paidAt: new Date(),
    });
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment succeeded:", paymentIntent.id);
  // Additional handling if needed
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Find client by Stripe customer ID
  const existingClients = await db
    .select()
    .from(clients)
    .where(eq(clients.stripeCustomerId, customerId))
    .limit(1);

  if (existingClients.length === 0) return;
  
  const client = existingClients[0];

  // Update or create subscription record
  const existingSubs = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
    .limit(1);

  const status = subscription.status === "active" ? "active" : 
                 subscription.status === "past_due" ? "past_due" : "cancelled";

  if (existingSubs.length > 0) {
    // Update existing subscription
    const subData = subscription as any;
    await db
      .update(subscriptions)
      .set({
        status,
        currentPeriodStart: new Date(subData.current_period_start * 1000),
        currentPeriodEnd: new Date(subData.current_period_end * 1000),
        cancelAtPeriodEnd: subData.cancel_at_period_end,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, existingSubs[0].id));
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  // Update subscription status
  await db
    .update(subscriptions)
    .set({
      status: "cancelled",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const invoiceData = invoice as any;
  
  // Find client
  const existingClients = await db
    .select()
    .from(clients)
    .where(eq(clients.stripeCustomerId, customerId))
    .limit(1);

  if (existingClients.length === 0) return;
  
  const client = existingClients[0];

  // Find subscription
  const subs = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, invoiceData.subscription as string))
    .limit(1);

  // Record invoice payment
  await db.insert(clientInvoices).values({
    clientId: client.id,
    subscriptionId: subs[0]?.id || null,
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId: invoiceData.payment_intent as string || null,
    amount: invoiceData.amount_paid,
    description: invoice.description || "Subscription payment",
    status: "paid",
    paidAt: new Date(),
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Update subscription to past_due
  const invoiceData = invoice as any;
  await db
    .update(subscriptions)
    .set({
      status: "past_due",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, invoiceData.subscription as string));
}
