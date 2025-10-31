
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clients, clientPortalUsers } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { createClientPortalUser } from '@/lib/client-auth';
import { sendClientWelcomeEmail } from '@/lib/portal-email';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const allClients = await db
      .select()
      .from(clients)
      .orderBy(desc(clients.createdAt));

    return NextResponse.json({ clients: allClients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const { fullName, email, phone, businessName, notes, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    // Create client record
    const [client] = await db
      .insert(clients)
      .values({
        fullName,
        email,
        phone: phone || null,
        businessName: businessName || null,
        notes: notes || null,
        status: 'active',
      })
      .returning();

    // Create portal user account
    await createClientPortalUser({
      clientId: client.id,
      email,
      password,
      fullName,
      phone: phone || undefined,
      role: 'client',
    });

    // Send welcome email
    await sendClientWelcomeEmail({
      clientName: fullName,
      clientEmail: email,
      password: password,
      businessName: businessName || undefined,
    });

    return NextResponse.json({
      success: true,
      client,
      message: 'Client created and welcome email sent successfully',
    });
  } catch (error: any) {
    console.error('Error creating client:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'A client with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
