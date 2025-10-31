
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { reason, summary, conversationHistory } = await request.json();

    if (!reason || !summary) {
      return NextResponse.json(
        { error: 'Reason and summary are required' },
        { status: 400 }
      );
    }

    // Create a transfer request in the database
    const transfer = await prisma.transferRequest.create({
      data: {
        reason,
        summary,
        conversationHistory: JSON.stringify(conversationHistory || []),
        status: 'pending',
        createdAt: new Date(),
      },
    });

    // In a real application, you would:
    // 1. Send notification to the sales agent (email, SMS, push notification)
    // 2. Update a dashboard showing pending transfers
    // 3. Maybe integrate with a CRM system

    // For now, we'll just log it and return success
    console.log('🔔 TRANSFER REQUEST:', {
      id: transfer.id,
      reason,
      summary,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      message: 'Your request has been forwarded to our sales team. They will be with you shortly!',
    });

  } catch (error) {
    console.error('Transfer to human error:', error);
    return NextResponse.json(
      { error: 'Failed to process transfer' },
      { status: 500 }
    );
  }
}
