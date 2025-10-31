
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { cookies } from 'next/headers';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_session')?.value === 'authenticated';
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all leads from phone calls (source = 'phone_call')
    const calls = await db
      .select()
      .from(leads)
      .where(eq(leads.source, 'phone_call'))
      .orderBy(desc(leads.createdAt))
      .limit(100);

    // Calculate stats
    const totalCalls = calls.length;
    const hotLeads = calls.filter((c: any) => c.status === 'hot').length;
    const warmLeads = calls.filter((c: any) => c.status === 'warm').length;
    const coldLeads = calls.filter((c: any) => c.status === 'cold').length;
    
    const durations = calls
      .map((c: any) => (c.metadata as any)?.callDuration || 0)
      .filter((d: any) => d > 0);
    const avgDuration = durations.length > 0 
      ? Math.round(durations.reduce((a: any, b: any) => a + b, 0) / durations.length)
      : 0;
    
    const conversionRate = totalCalls > 0 
      ? Math.round((hotLeads / totalCalls) * 100)
      : 0;

    // Format calls for the frontend
    const formattedCalls = calls.map((call: any) => ({
      id: call.id,
      name: call.name,
      phone: call.phone,
      businessName: call.businessName || 'Not specified',
      projectType: call.projectType,
      budget: call.budget,
      timeline: call.timeline,
      score: call.score,
      status: call.status,
      duration: (call.metadata as any)?.callDuration || 0,
      transcript: (call.metadata as any)?.transcript || '',
      createdAt: call.createdAt
    }));

    return NextResponse.json({
      calls: formattedCalls,
      stats: {
        totalCalls,
        hotLeads,
        warmLeads,
        coldLeads,
        avgDuration,
        conversionRate
      }
    });

  } catch (error) {
    console.error('Failed to fetch calls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calls' },
      { status: 500 }
    );
  }
}
