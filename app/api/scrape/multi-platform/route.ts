
import { NextRequest, NextResponse } from 'next/server';
import { scrapeAllPlatforms } from '@/lib/scrapers/unified-scraper';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      searchQuery,
      location,
      city,
      state,
      platforms = ['google'], // Default to Google only
      limit = 20,
    } = body;

    if (!searchQuery || !location) {
      return NextResponse.json(
        { error: 'Search query and location are required' },
        { status: 400 }
      );
    }

    console.log(`Starting multi-platform scrape: ${searchQuery} in ${location}`);
    console.log(`Platforms: ${platforms.join(', ')}`);

    const result = await scrapeAllPlatforms({
      searchQuery,
      location,
      city,
      state,
      platforms,
      limit,
      saveToDatabase: true,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Multi-platform scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape businesses', details: String(error) },
      { status: 500 }
    );
  }
}
