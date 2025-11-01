
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Contact } from '@prisma/client';

const prisma = new PrismaClient();

type ContactWithConversations = Contact & {
  conversations: {
    id: string;
    createdAt: Date;
    status: string;
  }[];
};

// GET - Fetch all contacts
export async function GET(request: NextRequest) {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        conversations: {
          select: {
            id: true,
            createdAt: true,
            status: true
          }
        }
      }
    });

    const stats = {
      total: contacts.length,
      new: contacts.filter((c: ContactWithConversations) => c.status === 'new').length,
      contacted: contacts.filter((c: ContactWithConversations) => c.status === 'contacted').length,
      qualified: contacts.filter((c: ContactWithConversations) => c.status === 'qualified').length,
      converted: contacts.filter((c: ContactWithConversations) => c.status === 'converted').length,
    };

    return NextResponse.json({ contacts, stats });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const { firstName, email } = await request.json();

    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'First name and email are required' },
        { status: 400 }
      );
    }

    // Check if contact already exists
    const existingContact = await prisma.contact.findUnique({
      where: { email }
    });

    if (existingContact) {
      return NextResponse.json({ 
        contact: existingContact,
        isNew: false 
      });
    }

    // Create new contact
    const contact = await prisma.contact.create({
      data: {
        firstName,
        email,
        source: 'chatbot',
        status: 'new'
      }
    });

    return NextResponse.json({ 
      contact,
      isNew: true 
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

// PATCH - Update contact status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status, notes } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}
