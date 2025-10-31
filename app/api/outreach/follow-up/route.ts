
import { NextRequest, NextResponse } from 'next/server';
import { sendFollowUpCampaign } from '@/lib/outreach/automation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { daysSinceLastContact = 7 } = body;

    console.log(`Sending follow-ups to leads contacted ${daysSinceLastContact} days ago`);

    const result = await sendFollowUpCampaign(daysSinceLastContact);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Follow-up campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to send follow-ups', details: String(error) },
      { status: 500 }
    );
  }
}
