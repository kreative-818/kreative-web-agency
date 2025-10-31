
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, aiChats, callLogs, aiConversations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Webhook endpoint to receive call data from Quo.ai Sona
 * This endpoint captures lead data from phone calls handled by Sona AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📞 Received Sona webhook:', JSON.stringify(body, null, 2));

    // Quo.ai Sona sends data in this format:
    // {
    //   "call_id": "string",
    //   "phone_number": "string",
    //   "duration": number,
    //   "timestamp": "string",
    //   "job_completed": "string", // "lead_qualification" or "message_taking"
    //   "job_data": {
    //     // Fields collected by the job
    //   },
    //   "transcript": "string",
    //   "recording_url": "string",
    //   "transferred": boolean // if call was transferred to human
    // }

    const {
      call_id,
      phone_number,
      duration,
      timestamp,
      job_completed,
      job_data,
      transcript,
      recording_url,
      transferred
    } = body;

    // 1. Check if caller is an existing customer
    const existingCustomer = await db
      .select()
      .from(leads)
      .where(eq(leads.phone, phone_number))
      .limit(1);

    const isExistingCustomer = existingCustomer.length > 0;
    const existingLeadId = isExistingCustomer ? existingCustomer[0].id : null;

    console.log(`👤 Caller ${phone_number} is ${isExistingCustomer ? 'EXISTING CUSTOMER' : 'NEW CUSTOMER'}`);

    // 2. Log the call
    await db.insert(callLogs).values({
      callId: call_id,
      phoneNumber: phone_number,
      fromNumber: phone_number,
      toNumber: process.env.OPENPHONE_PHONE_NUMBER || '(984) 400-9443',
      direction: 'inbound',
      status: job_completed === 'message_taking' ? 'voicemail' : 'completed',
      duration: duration || 0,
      recording: recording_url,
      recordingUrl: recording_url,
      transcript: transcript,
      transcription: transcript,
      summary: job_data ? JSON.stringify(job_data) : null,
      customerType: isExistingCustomer ? 'existing' : 'new',
      isExistingCustomer,
      transferredToHuman: transferred || false,
      leadId: existingLeadId,
      metadata: {
        jobCompleted: job_completed,
        timestamp,
        rawJobData: job_data,
      },
    });

    // Extract lead data from job_data
    const leadData = extractLeadFromJobData(job_data, job_completed);

    // If this is just a message (not a lead qualification), treat it differently
    if (job_completed === 'message_taking') {
      await handleMessage(body);
      return NextResponse.json({
        success: true,
        type: 'message_recorded'
      });
    }

    // Calculate lead score
    const leadScore = calculateLeadScore(leadData);

    // Save to database using Drizzle
    const [savedLead] = await db.insert(leads).values({
      name: leadData.name || 'Unknown',
      email: leadData.email || '',
      phone: phone_number || leadData.phone || '',
      businessName: leadData.businessName || leadData.company || '',
      projectType: leadData.serviceInterest || leadData.projectType || 'Unknown',
      budget: leadData.budget || 'Not specified',
      timeline: leadData.timeline || 'Not specified',
      source: 'sona_phone_call',
      score: leadScore,
      status: getLeadStatus(leadScore),
      notes: transcript ? `Call Duration: ${duration}s\n\nTranscript:\n${transcript}` : `Call Duration: ${duration}s`,
      metadata: {
        callId: call_id,
        callDuration: duration,
        timestamp: timestamp,
        jobCompleted: job_completed,
        recordingUrl: recording_url,
        transcript: transcript,
        rawJobData: job_data
      }
    }).returning();

    // Log the call in admin dashboard
    await db.insert(aiChats).values({
      visitorId: `sona_call_${call_id}`,
      messages: [
        {
          role: 'system',
          content: `Phone call received from ${leadData.name || 'Unknown'} via Sona AI`
        },
        {
          role: 'assistant',
          content: transcript || 'No transcript available'
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

    // If HOT lead, send SMS notification to owner
    if (leadScore >= 80) {
      await sendHotLeadNotification(savedLead);
    }

    return NextResponse.json({
      success: true,
      leadId: savedLead.id,
      leadScore: leadScore,
      status: getLeadStatus(leadScore)
    });

  } catch (error) {
    console.error('Sona webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Extract lead data from Sona job data
function extractLeadFromJobData(jobData: any, jobType: string): any {
  if (!jobData) return {};

  const data: any = {};

  // Common field mappings (Sona uses these field names)
  if (jobData.name) data.name = jobData.name;
  if (jobData.email) data.email = jobData.email;
  if (jobData.phone) data.phone = jobData.phone;
  if (jobData.company) data.company = jobData.company;
  if (jobData.business_name) data.businessName = jobData.business_name;
  
  // Lead qualification specific fields
  if (jobType === 'lead_qualification') {
    if (jobData.service_interest) data.serviceInterest = jobData.service_interest;
    if (jobData.timeline) data.timeline = jobData.timeline;
    if (jobData.budget) data.budget = jobData.budget;
    if (jobData.company_size) data.companySize = jobData.company_size;
  }

  return data;
}

// Handle message taking (non-lead calls)
async function handleMessage(body: any) {
  const { call_id, phone_number, transcript, job_data } = body;

  await db.insert(aiChats).values({
    visitorId: `sona_message_${call_id}`,
    messages: [
      {
        role: 'system',
        content: `Message from ${phone_number}`
      },
      {
        role: 'user',
        content: job_data?.message || transcript || 'No message content'
      }
    ],
    intent: 'general_inquiry',
    leadCaptured: false,
    leadData: {
      phone: phone_number,
      message: job_data?.message
    }
  });
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
  if (timelineStr.includes('asap') || timelineStr.includes('immediately') || timelineStr.includes('urgent')) {
    score += 30;
  } else if (timelineStr.includes('week') || timelineStr.includes('1 week') || timelineStr.includes('1-2 weeks')) {
    score += 25;
  } else if (timelineStr.includes('month') && !timelineStr.includes('months')) {
    score += 20;
  } else if (timelineStr.includes('2') && timelineStr.includes('month')) {
    score += 15;
  } else if (timelineStr.includes('3') && timelineStr.includes('month')) {
    score += 10;
  }

  // Service interest/Project type scoring (20 points max)
  const serviceStr = leadData.serviceInterest?.toLowerCase() || leadData.projectType?.toLowerCase() || '';
  if (serviceStr.includes('web app') || serviceStr.includes('custom') || serviceStr.includes('application')) {
    score += 20;
  } else if (serviceStr.includes('ecommerce') || serviceStr.includes('e-commerce') || serviceStr.includes('online store')) {
    score += 18;
  } else if (serviceStr.includes('ai') || serviceStr.includes('automation') || serviceStr.includes('chatbot')) {
    score += 16;
  } else if (serviceStr.includes('website') || serviceStr.includes('web design')) {
    score += 14;
  }

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

    const message = `🔥 HOT LEAD FROM SONA AI!

${lead.name} | ${lead.businessName || 'No company'}
📞 ${lead.phone}
📧 ${lead.email || 'No email'}

💰 Budget: ${lead.budget}
🎯 Project: ${lead.projectType}
⏰ Timeline: ${lead.timeline}

Score: ${lead.score}/100

Check dashboard: https://kreativeaiagency.com/admin/contacts`;

    // Send via OpenPhone or Twilio
    const response = await fetch('https://api.openphone.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `${process.env.OPENPHONE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.OPENPHONE_PHONE_NUMBER,
        to: [ownerPhone],
        content: message
      })
    });

    if (!response.ok) {
      console.error('Failed to send SMS notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending hot lead notification:', error);
  }
}

// Verify webhook signature (optional security measure)
async function verifyWebhookSignature(request: NextRequest): Promise<boolean> {
  const signature = request.headers.get('x-quo-signature');
  const webhookSecret = process.env.QUO_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return true; // Skip verification if not configured
  }

  // Implement signature verification here if Quo.ai provides webhook signing
  // This would typically involve HMAC validation

  return true;
}
