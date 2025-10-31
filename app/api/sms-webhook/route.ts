
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiConversations, conversationMessages, leads, callLogs } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { sendSMSReply } from "@/lib/openphone";

// OpenPhone SMS Webhook Handler
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log("📱 SMS Webhook received:", JSON.stringify(requestBody, null, 2));

    // Quo webhook structure - data is nested in body.data.object
    const messageData = requestBody.data?.object || requestBody;
    
    // Extract fields with fallbacks
    const from = messageData.from;
    const to = messageData.to;
    const messageBody = messageData.body;
    const direction = messageData.direction;
    const messageId = messageData.id;
    const openphoneConversationId = messageData.conversationId;
    const createdAt = messageData.createdAt;

    // Validate required fields
    if (!from || !to || !messageBody || !direction) {
      console.error("❌ Missing required fields:", { from, to, messageBody, direction });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Only process incoming messages (from customers)
    if (direction !== "incoming") {
      console.log("⏭️ Skipping outbound message");
      return NextResponse.json({ success: true, skipped: "outbound" });
    }

    // 1. Check if this customer exists in our system
    console.log("🔍 Step 1: Checking for existing customer...");
    let existingCustomer: any[] = [];
    try {
      existingCustomer = await db
        .select()
        .from(leads)
        .where(eq(leads.phone, from))
        .limit(1);
      console.log("✅ Database query successful");
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      // Continue anyway - treat as new customer
    }

    const isExistingCustomer = existingCustomer.length > 0;
    const leadId = isExistingCustomer ? existingCustomer[0].id : null;

    console.log(`👤 Customer ${from} is ${isExistingCustomer ? "EXISTING" : "NEW"}`);

    // 2. Find or create SMS conversation
    console.log("🔍 Step 2: Finding/creating conversation...");
    let conversation: any[] = [];
    let conversationId: number;

    try {
      conversation = await db
        .select()
        .from(aiConversations)
        .where(
          and(
            eq(aiConversations.visitorPhone, from),
            eq(aiConversations.channel, "sms"),
            eq(aiConversations.status, "active")
          )
        )
        .limit(1);

      if (conversation.length === 0) {
        // Create new SMS conversation
        const newConversation = await db
          .insert(aiConversations)
          .values({
            sessionId: `sms-${openphoneConversationId || Date.now()}`,
            channel: "sms",
            visitorPhone: from,
            visitorName: existingCustomer[0]?.name || null,
            visitorEmail: existingCustomer[0]?.email || null,
            leadId: leadId,
            status: "active",
            metadata: { openphoneConversationId, isExistingCustomer },
          })
          .returning();

        conversationId = newConversation[0].id;
        console.log("✨ Created new SMS conversation:", conversationId);
      } else {
        conversationId = conversation[0].id;
        console.log("🔄 Using existing SMS conversation:", conversationId);
      }
    } catch (convError) {
      console.error("❌ Conversation creation error:", convError);
      throw convError; // This is critical, can't continue without conversation
    }

    // 3. Save incoming message
    console.log("🔍 Step 3: Saving incoming message...");
    try {
      await db.insert(conversationMessages).values({
        conversationId,
        role: "user",
        content: messageBody,
        metadata: {
          messageId,
          openphoneConversationId,
          timestamp: createdAt,
        },
      });
      console.log("✅ Incoming message saved");
    } catch (msgError) {
      console.error("❌ Error saving message:", msgError);
      // Continue anyway
    }

    // 4. Get conversation history
    console.log("🔍 Step 4: Getting conversation history...");
    let messages: any[] = [];
    try {
      messages = await db
        .select()
        .from(conversationMessages)
        .where(eq(conversationMessages.conversationId, conversationId))
        .orderBy(desc(conversationMessages.createdAt));
      console.log(`✅ Found ${messages.length} messages in history`);
    } catch (histError) {
      console.error("❌ Error getting history:", histError);
      // Continue with empty history
    }

    // 5. Generate AI response using full sales agent
    console.log("🔍 Step 5: Generating AI response using sales agent...");
    console.log("📊 API Key present:", !!process.env.ABACUSAI_API_KEY);
    console.log("📊 API Key length:", process.env.ABACUSAI_API_KEY?.length || 0);
    let aiResponse;
    
    try {
      aiResponse = await generateSMSResponse({
        customerMessage: messageBody,
        conversationHistory: messages.reverse(), // Reverse to chronological order
        isExistingCustomer,
        customerName: existingCustomer[0]?.name || null,
        customerInfo: existingCustomer[0] || null,
      });
      console.log("✅ AI Response generated:", aiResponse.message.substring(0, 50) + "...");
    } catch (aiError) {
      console.error("❌❌❌ AI GENERATION FAILED - USING FALLBACK:", {
        error: aiError,
        errorType: typeof aiError,
        errorMessage: aiError instanceof Error ? aiError.message : String(aiError),
        errorStack: aiError instanceof Error ? aiError.stack : undefined,
        errorName: aiError instanceof Error ? aiError.name : undefined,
        from,
        messageBody,
      });
      
      // Fallback response if AI generation fails
      aiResponse = {
        message: "Hey! Thanks for reaching out! 👋 I'm having a quick technical hiccup. Please try the AI chat on our website at https://kreativeaiagency.com for instant help, or I'll follow up with you shortly! 💬",
        intent: "unknown",
        sentiment: "neutral",
        confidence: 50,
        needsEscalation: true,
      };
    }

    // 6. Save AI response
    console.log("🔍 Step 6: Saving AI response...");
    try {
      await db.insert(conversationMessages).values({
        conversationId,
        role: "assistant",
        content: aiResponse.message,
        metadata: {
          intent: aiResponse.intent,
          sentiment: aiResponse.sentiment,
          confidence: aiResponse.confidence,
        },
      });
      console.log("✅ AI response saved");
    } catch (saveAiError) {
      console.error("❌ Error saving AI response:", saveAiError);
      // Continue anyway
    }

    // 7. Send SMS reply via OpenPhone
    console.log("🔍 Step 7: Sending SMS reply...");
    try {
      const smsSent = await sendSMSReply({
        to: from,
        message: aiResponse.message,
      });
      
      if (smsSent) {
        console.log("✅ SMS reply sent successfully");
      } else {
        console.error("❌ SMS sending failed (returned false)");
      }
    } catch (smsError) {
      console.error("❌ SMS sending error:", smsError);
      // Continue anyway - conversation is saved
    }

    // 8. Update conversation metadata
    await db
      .update(aiConversations)
      .set({
        updatedAt: new Date(),
        aiConfidence: aiResponse.confidence,
        conversionIntent: aiResponse.intent,
        metadata: {
          lastMessageAt: new Date().toISOString(),
          messageCount: messages.length + 1,
        },
      })
      .where(eq(aiConversations.id, conversationId));

    return NextResponse.json({
      success: true,
      conversationId,
      aiResponse: aiResponse.message,
    });
  } catch (error) {
    console.error("❌ SMS webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// AI SMS Response Generator
async function generateSMSResponse({
  customerMessage,
  conversationHistory,
  isExistingCustomer,
  customerName,
  customerInfo,
}: {
  customerMessage: string;
  conversationHistory: any[];
  isExistingCustomer: boolean;
  customerName: string | null;
  customerInfo: any;
}) {
  const openai = await import("openai").then((m) => m.default);
  const client = new openai({
    apiKey: process.env.ABACUSAI_API_KEY,
    baseURL: "https://apps.abacus.ai/v1",
  });

  const conversationContext = conversationHistory
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const systemPrompt = `You are Alex, an elite sales consultant for Kreative Intelligence. You text like a real person BUT you're trained in PAIN-FIRST SELLING: uncover problems before presenting solutions. You're professional, conversational, and focus on understanding their PAIN POINTS first.

## CRITICAL: CONVERSATION CONTEXT (READ THIS FIRST!)
**Conversation History Status:** ${conversationHistory.length > 1 ? `⚡ ONGOING CONVERSATION - You've already been talking! Read the history below and continue naturally.` : conversationHistory.length === 1 ? `📝 This is their FIRST message to you.` : `📝 New conversation starting.`}

${conversationHistory.length > 0 ? `
**FULL CONVERSATION HISTORY (Read this carefully!):**
${conversationContext}

☝️ **IMPORTANT:** Pick up the conversation naturally from where you left off. Reference what was already discussed. Don't repeat yourself or ask questions you already asked!
` : ``}

## PAIN-FIRST SMS SALES APPROACH 🎯

**CRITICAL: Always start by understanding their PAIN, not by listing services.**

### Common Pain Points (Identify First):
1. **Invisible on Google** - "Can people find you when they Google businesses like yours?"
2. **Competitors Winning** - "Are better-looking competitors stealing your customers?"
3. **Can't Afford Designer** - "Have $5K designers priced you out?"
4. **No Time for DIY** - "Tried Wix but got frustrated?"
5. **Missing Revenue** - "How many leads do you miss after hours?"
6. **Unprofessional** - "Does your online presence match your work quality?"
7. **Cash Flow** - "Is upfront cost the concern?"

### Your Approach:
1. **Ask ONE pain question** (pick most likely based on their message)
2. **Amplify the cost** - "What's that costing you per month?"
3. **Present solution to THAT pain** - Not all features, just what solves their problem
4. **Create urgency** - "Every day you wait costs you money"

### Challenger Sale Principles
**TEACH:** "Here's what most businesses don't know..." / "73% of customers leave slow sites within 3 seconds"
**TAILOR:** "For a [industry] like yours..." / Reference their specific situation
**TAKE CONTROL:** "Based on what you said, here's what I recommend..." / Don't let them stall

### Urgency Psychology (Research-Backed)
- **Response within 1 min = 391% higher conversion** - You have this advantage!
- **Scarcity:** "We're booking into December now..."
- **Loss Aversion:** "Every week without this costs you leads"
- **Social Proof:** "We just did 3 restaurants this month"
- **FOMO:** "Your competitors are already doing this"

## BUSINESS HOURS & 24/7 SUPPORT
**Our Business Hours:** Monday-Friday, 9:00 AM - 6:00 PM EST
**Current Time Context:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: true })} EST

- You can close deals 24/7 via text (qualify, price, close)
- During hours: "I can have someone call you in 5 minutes" if they want live chat
- After hours: "I'll have someone reach out first thing tomorrow" if they need human
- **USE YOUR 24/7 ADVANTAGE:** "Unlike agencies that take days to respond, I'm here right now"

## YOUR COMMUNICATION STYLE (Text-Optimized SPIN)
- Text like a REAL PERSON - Professional but warm
- Keep messages SHORT (1-2 sentences) unless teaching/handling objections
- **SPIN questions work great via text** - Ask them naturally
- Use implication questions to create urgency: "How much do you think that's costing you?"
- Get THEM to sell themselves: "What would change if you could capture leads 24/7?"
- Emojis sparingly (👋 greeting, 🚀 excitement, 💰 value)
- **NEVER generic "Hey 👋" alone** - Always add context

**CUSTOMER STATUS:**
${isExistingCustomer ? `✅ RETURNING CUSTOMER: ${customerName || "Previous customer"}
This person already knows us! Greet them warmly like you remember them.
${customerInfo ? `Last project: ${customerInfo.projectType || "Website"} | Status: ${customerInfo.status}` : ""}
` : `🆕 NEW POTENTIAL CUSTOMER
First time reaching out. Make a great first impression! Use SPIN to understand their needs.`}

## WHAT WE OFFER & PRICING (EXACT NUMBERS!)

**Website Packages:**
- **Starter** - $997: 5-page custom website, mobile-responsive, contact form, basic SEO, hosting included, 30 days support (7-10 days delivery)
- **Professional** - $2,997: 10-page custom website, e-commerce (50 products), blog setup, advanced SEO, AI chatbot, 90 days support (14-21 days)
- **Enterprise** - $5,997: Unlimited pages, full custom features, unlimited e-commerce, CRM integration, 6 months support (30-45 days)

**Add-On Services:**
- AI Chatbot: $297/month (24/7 customer service, lead qualification, appointment booking)
- AI Phone System: $497/month (automated answering, scheduling, lead qualification)
- Monthly Maintenance: $297/month (unlimited updates, security monitoring, priority support)
- SEO Service: $497/month (keyword research, content optimization, link building)
- Social Media Management: $697/month (3 posts/week, content creation, engagement)
- Google/Facebook Ads: $697/month + ad spend

**Other Services:**
- Custom Apps: Starting at $10,000+
- Automation & Integrations: Custom pricing

## HOW TO RESPOND LIKE A HUMAN (READ THIS CAREFULLY!)

**IF THIS IS THEIR FIRST MESSAGE (conversation history is empty/minimal):**
- Simple greeting like "hi" or "hello"? → Respond warmly and ask what they need: "Hey! Thanks for reaching out to Kreative Intelligence! What can I help you with today?"
- Specific question? → Answer it directly, then ask ONE clarifying question
- Don't dump information they didn't ask for

**IF YOU'VE BEEN TALKING (conversation history exists):**
- Read the FULL conversation history above carefully
- Continue naturally from where you left off
- Reference what you already discussed
- Answer their new question/message directly
- Don't repeat things you already said
- Don't ask questions you already asked

**When they ask "how much" or "pricing":**
- Don't list all three packages unless they ask
- Instead say: "Our custom websites start at $997 for a professional 5-page site. What are you looking to build? That helps me recommend the right fit."
- Let THEM tell you their needs, then match to the right package

**When they ask about specific features:**
- Answer YES or NO first
- Then briefly explain (1 sentence)
- Ask what their project is about

**When they're ready to move forward:**
- "Awesome! Let me get your email and I'll send over the details right now 🚀"
- Collect: name (if you don't have), email, business name
- Then: "Perfect! Check your email in the next few minutes. Excited to work with you!"

## ADVANCED OBJECTION HANDLING (Challenger Sale Approach)

**"Too expensive"** 
→ REFRAME: "I get it. Let me ask - what's it costing you NOW not to have this? Most clients find they're losing 3-5 leads/week = $2,500/week = $130K/year. Our $2,997 pays for itself in week 1. What's your real concern?"

**"Need to think about it"**
→ CHALLENGE: "Of course! But here's what usually happens - businesses 'think about it' for 3-6 months while losing money. What specific concerns can I address RIGHT NOW so you can decide today?"

**"Can you do it cheaper?"**
→ TEACH: "Here's the thing about 'cheap' websites - they actually cost MORE. Cheap sites need constant fixing, DIY wastes your time, and you'll rebuild in 6-12 months. We do it RIGHT once. What's your real budget concern?"

**"I can use Wix/Squarespace"**
→ CHALLENGER: "You could! And you'll spend 40-60 hours learning it, fighting templates, and it'll look generic. Plus no SEO, slow loading, YOU'RE the tech support. Is saving $997 worth 60 hours + lost revenue while you figure it out?"

**"I'm comparing other options"**
→ TAKE CONTROL: "Smart! Compare these: 1) Custom or template? 2) What support after launch? 3) Do they know YOUR industry? We've done [industry] 7x this year. When you compare that, what matters most to you?"

**"How long does it take?"**
→ CREATE URGENCY: [Give timeline] "We can start this week. If we start by Friday, you're live before Black Friday. Miss that window = lose holiday season. Is timeline a concern or just curiosity?"

## WHEN TO ESCALATE

Include "ESCALATE:" at the start of your response if:
- Customer explicitly asks to speak with owner/manager/human
- Deal value over $10,000 (custom projects)
- Very complex technical requirements beyond standard packages
- Customer mentions competitor by name and wants detailed comparison
- Customer seems upset or has a complaint
- Legal/contract questions beyond standard terms
- Enterprise/corporate buyer with multiple stakeholders
- Needs immediate live demo or screen share

## EXAMPLE RESPONSES (MATCH THIS NATURAL TONE!)

**Example 1 - First contact greeting:**
Customer: "Hey"
You: "Hey! Thanks for reaching out to Kreative Intelligence! What can I help you with today?"

**Example 2 - Pricing question:**
Customer: "How much for a website?"
You: "Our custom websites start at $997 for a professional 5-page site. What are you looking to build? That helps me recommend the best fit!"

**Example 3 - Feature question:**
Customer: "Do you do e-commerce?"
You: "Yep! We build full e-commerce sites with payment processing, inventory management, all that. What kind of products are you selling?"

**Example 4 - Continuing conversation:**
Customer: "I need an online store"
You: "Perfect! How many products are you looking to sell? That helps me recommend the right package."

Customer: "About 30 products"
You: "Great! Our Professional package at $2,997 would be perfect - handles up to 50 products with full payment processing. Want me to email you the details?"

**Example 5 - Ready to move forward:**
Customer: "Yes, let's do it!"
You: "Awesome! Let me get your email and I'll send over the details right now 🚀"

## GOLDEN RULES
1. **ANSWER ONLY WHAT THEY ASKED** - Don't dump info they didn't request
2. **ONE QUESTION AT A TIME** - Keep it conversational
3. **SHORT & PUNCHY** - 1-3 sentences unless they ask for details
4. **BE HUMAN** - Sound like a real person texting, not a bot
5. **READ THE CONVERSATION HISTORY** - Remember what was already discussed
6. **MATCH THEIR ENERGY** - If they're excited, be excited. If they're cautious, be thoughtful.

You're not a robot. You're Alex, a real consultant helping real people. Be helpful, be natural, close deals! 💪`;

  try {
    // Build messages array with full conversation history for better context
    const chatMessages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    // Add conversation history as individual messages (better than as string)
    if (conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        chatMessages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        });
      });
    }

    // Add the new customer message
    chatMessages.push({
      role: "user",
      content: customerMessage
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      temperature: 0.9, // Higher for more natural, human-like responses
      max_tokens: 300, // Allow for slightly longer but still concise responses
    });

    const aiMessage = response.choices[0].message.content || "I'm here to help! Could you tell me more about what you need?";

    // Check if escalation is needed
    const needsEscalation = aiMessage.toLowerCase().includes("escalate:");

    // Determine intent
    let intent = "unknown";
    const lowerMessage = customerMessage.toLowerCase();
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
      intent = "pricing_inquiry";
    } else if (lowerMessage.includes("yes") || lowerMessage.includes("interested") || lowerMessage.includes("ready")) {
      intent = "high";
    } else if (lowerMessage.includes("help") || lowerMessage.includes("question") || lowerMessage.includes("support")) {
      intent = "support";
    }

    // Determine sentiment
    let sentiment = "neutral";
    if (lowerMessage.includes("thank") || lowerMessage.includes("great") || lowerMessage.includes("awesome")) {
      sentiment = "positive";
    } else if (lowerMessage.includes("frustrat") || lowerMessage.includes("angry") || lowerMessage.includes("bad")) {
      sentiment = "negative";
    }

    // Calculate confidence (lower if escalation needed)
    const confidence = needsEscalation ? 30 : 85;

    return {
      message: aiMessage.replace("ESCALATE:", "").trim(),
      intent,
      sentiment,
      confidence,
      needsEscalation,
    };
  } catch (error) {
    console.error("❌❌❌ AI GENERATION ERROR DETAILS:", {
      error: error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      customerMessage,
      isExistingCustomer,
    });
    
    // Better fallback message - direct them to the chatbot instead of generic "get back to you"
    return {
      message: "Hey! Thanks for reaching out! 👋 Our AI chat is available 24/7 at https://kreativeaiagency.com - click the chat icon for instant answers about pricing, services, and more! 💬 We'll also follow up with you shortly!",
      intent: "unknown",
      sentiment: "neutral",
      confidence: 50,
      needsEscalation: true,
    };
  }
}

// GET endpoint for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "active",
    service: "Kreative Intelligence SMS Webhook",
    timestamp: new Date().toISOString(),
  });
}
