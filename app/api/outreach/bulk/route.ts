
import { NextRequest, NextResponse } from 'next/server';
import { startBulkOutreach } from '@/lib/outreach/automation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { minScore, category, city, limit } = body;

    console.log('Starting bulk outreach campaign:', { minScore, category, city, limit });

    const result = await startBulkOutreach({
      minScore,
      category,
      city,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Bulk outreach error:', error);
    return NextResponse.json(
      { error: 'Failed to start bulk outreach', details: String(error) },
      { status: 500 }
    );
  }
}
