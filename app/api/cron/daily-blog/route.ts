
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Vercel Cron Job endpoint for daily blog generation
export async function GET(request: NextRequest) {
  try {
    // Verify this is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Call the auto-generate endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'https://creative-web-agency-zlgi4u.abacusai.app';
    const response = await fetch(`${baseUrl}/api/blog/auto-generate`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${cronSecret}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Daily blog post generated successfully',
        post: result.post,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: 'Cron job failed' },
      { status: 500 }
    );
  }
}

