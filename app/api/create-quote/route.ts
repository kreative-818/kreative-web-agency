
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { service, price, description, conversationHistory } = await request.json();

    if (!service || !price) {
      return NextResponse.json(
        { error: 'Service and price are required' },
        { status: 400 }
      );
    }

    // Create a quote in the database
    const quote = await prisma.quote.create({
      data: {
        service,
        price,
        description: description || '',
        conversationHistory: JSON.stringify(conversationHistory || []),
        status: 'pending',
        createdAt: new Date(),
      },
    });

    // Generate a checkout URL
    const checkoutUrl = `/checkout/${quote.id}`;

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      checkoutUrl,
    });

  } catch (error) {
    console.error('Create quote error:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}
