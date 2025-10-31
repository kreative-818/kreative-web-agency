
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all conversations
export async function GET(request: NextRequest) {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        contact: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST - Create or update a conversation
export async function POST(request: NextRequest) {
  try {
    const { conversationId, contactId, firstName, email, messages } = await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Calculate expiration time (45 minutes from now)
    const expiresAt = new Date(Date.now() + 45 * 60 * 1000);

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    let conversation;

    if (existingConversation) {
      // Update existing conversation
      conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messages: JSON.stringify(messages || []),
          lastMessageAt: new Date(),
          expiresAt,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          id: conversationId,
          contactId,
          firstName,
          email,
          messages: JSON.stringify(messages || []),
          expiresAt,
          status: 'active',
          lastMessageAt: new Date()
        }
      });
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json(
      { error: 'Failed to save conversation' },
      { status: 500 }
    );
  }
}
