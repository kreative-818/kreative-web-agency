
import { NextRequest, NextResponse } from 'next/server';
import { getClientPortalSession } from '@/lib/client-auth';
import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getClientPortalSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get client details
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, user.clientId))
      .limit(1);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
      client: client || null,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
