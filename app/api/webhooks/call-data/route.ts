
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, aiChats } from '@/lib/db/schema';

// Webhook endpoint to receive call data from Vapi.ai
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Vapi sends call data in this format
    const {
      call,
      transcript,
      summary,
      metadata
    } = body;

    // Extract lead data from the call
    const leadData = extractLeadData(transcript, summary);

    // Calculate lead score
    const leadScore = calculateLeadScore(leadData);

    // Save to database using Drizzle
    const [savedLead] = await db.insert(leads).values({
      name: leadData.name || 'Unknown',
      email: leadData.email || '',
      phone: call.customer?.number || leadData.phone || '',
      businessName: leadData.businessName || '',
      projectType: leadData.projectType || 'Unknown',
      budget: leadData.budget || 'Not specified',
      timeline: leadData.timeline || 'Not specified',
      source: 'phone_call',
      score: leadScore,
      status: getLeadStatus(leadScore),
      notes: `Call Duration: ${call.duration}s\n\nTranscript:\n${transcript}\n\nSummary:\n${summary}`,
      metadata: {
        callId: call.id,
        callDuration: call.duration,
        callStartedAt: call.startedAt,
        callEndedAt: call.endedAt,
        voiceAgent: 'Sora',
        transcript: transcript,
        summary: summary
      }
    }).returning();

    // If HOT lead, send SMS notification to owner
    if (leadScore >= 80) {
      await sendHotLeadNotification(savedLead);
    }

    // Log the call in admin dashboard
    await db.insert(aiChats).values({
      visitorId: `call_${call.id}`,
      messages: [
        {
          role: 'system',
          content: `Phone call received from ${leadData.name || 'Unknown'}`
        },
        {
          role: 'assistant',
          content: transcript
        }
      ],
      intent: determineIntent(leadData),
      leadCaptured: true,
      leadData: {
        ...leadData,
        score: leadScore,
        status: getLeadStatus(leadScore)
      }
    });

    return NextResponse.json({
      success: true,
      leadId: savedLead.id,
      leadScore: leadScore,
      status: getLeadStatus(leadScore)
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Extract lead data from transcript using AI
function extractLeadData(transcript: string, summary: string): any {
  const data: any = {};

  // Extract name
  const nameMatch = transcript.match(/(?:my name is|i'm|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch) data.name = nameMatch[1];

  // Extract business name
  const businessMatch = transcript.match(/(?:business is|company is|business name is|work at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
  if (businessMatch) data.businessName = businessMatch[1];

  // Extract email
  const emailMatch = transcript.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) data.email = emailMatch[1];

  // Extract phone
  const phoneMatch = transcript.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})/);
  if (phoneMatch) data.phone = phoneMatch[1];

  // Extract budget
  const budgetMatch = transcript.match(/budget.*?(\$?\d+(?:,\d+)?(?:\s*(?:to|-)\s*\$?\d+(?:,\d+)?)?)/i);
  if (budgetMatch) data.budget = budgetMatch[1];

  // Extract timeline
  const timelineMatch = transcript.match(/(?:timeline|launch|start|ready).*?(\d+\s+(?:days?|weeks?|months?))/i);
  if (timelineMatch) data.timeline = timelineMatch[1];

  // Extract project type
  if (transcript.match(/e-?commerce|online store|shopping cart/i)) {
    data.projectType = 'E-commerce';
  } else if (transcript.match(/web app|application|custom software/i)) {
    data.projectType = 'Web Application';
  } else if (transcript.match(/ai|automation|chatbot/i)) {
    data.projectType = 'AI Integration';
  } else if (transcript.match(/website|web design|landing page/i)) {
    data.projectType = 'Website Development';
  }

  return data;
}

// Calculate lead score (0-100)
function calculateLeadScore(leadData: any): number {
  let score = 0;

  // Budget scoring (40 points max)
  const budgetStr = leadData.budget?.toString().toLowerCase() || '';
  const budgetNum = parseInt(budgetStr.replace(/[^0-9]/g, ''));
  
  if (budgetNum >= 5000) score += 40;
  else if (budgetNum >= 3000) score += 35;
  else if (budgetNum >= 1500) score += 30;
  else if (budgetNum >= 1000) score += 20;
  else if (budgetNum >= 500) score += 10;

  // Timeline scoring (30 points max)
  const timelineStr = leadData.timeline?.toLowerCase() || '';
  if (timelineStr.includes('asap') || timelineStr.includes('immediately')) score += 30;
  else if (timelineStr.includes('week')) score += 25;
  else if (timelineStr.includes('month') && !timelineStr.includes('months')) score += 20;
  else if (timelineStr.includes('2') && timelineStr.includes('month')) score += 15;
  else if (timelineStr.includes('3') && timelineStr.includes('month')) score += 10;

  // Project type scoring (20 points max)
  if (leadData.projectType === 'Web Application') score += 20;
  else if (leadData.projectType === 'E-commerce') score += 18;
  else if (leadData.projectType === 'AI Integration') score += 16;
  else if (leadData.projectType === 'Website Development') score += 14;

  // Contact info completeness (10 points max)
  if (leadData.name) score += 3;
  if (leadData.email) score += 4;
  if (leadData.phone) score += 3;

  return Math.min(score, 100);
}

// Get lead status based on score
function getLeadStatus(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 75) return 'hot';
  if (score >= 50) return 'warm';
  return 'cold';
}

// Determine intent based on lead data
function determineIntent(leadData: any): string {
  const budget = parseInt(leadData.budget?.replace(/[^0-9]/g, '') || '0');
  
  if (budget >= 3000) return 'high_value_inquiry';
  if (budget >= 1500) return 'qualified_lead';
  if (budget >= 500) return 'budget_inquiry';
  return 'information_request';
}

// Send SMS notification for hot leads
async function sendHotLeadNotification(lead: any) {
  try {
    const ownerPhone = process.env.OWNER_PHONE_NUMBER;
    if (!ownerPhone) return;

    const message = `🔥 HOT LEAD FROM PHONE CALL!

${lead.name} | ${lead.businessName}
📞 ${lead.phone}
📧 ${lead.email}

💰 Budget: ${lead.budget}
🎯 Project: ${lead.projectType}
⏰ Timeline: ${lead.timeline}

Score: ${lead.score}/100

Check dashboard: https://creative-web-agency-zlgi4u.abacusai.app/admin/contacts`;

    // Send via OpenPhone
    const response = await fetch('https://api.openphone.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': process.env.OPENPHONE_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.OPENPHONE_PHONE_NUMBER,
        to: [ownerPhone],
        content: message
      })
    });

    if (!response.ok) {
      console.error('Failed to send SMS notification');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
