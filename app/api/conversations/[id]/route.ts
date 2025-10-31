
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch a specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        contact: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Check if conversation is expired
    const isExpired = new Date() > conversation.expiresAt;

    return NextResponse.json({ 
      conversation,
      isExpired 
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}
