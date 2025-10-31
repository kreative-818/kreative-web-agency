
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const PRIMARY_KEYWORDS = [
  {
    keyword: 'digital marketing agency',
    searchVolume: 18100,
    difficulty: 89,
    cpc: 10.62,
    intent: 'COMMERCIAL',
    isPrimary: true,
    pages: ['/services', '/'],
  },
  {
    keyword: 'web design services',
    searchVolume: 201000,
    difficulty: 75,
    cpc: 12.50,
    intent: 'COMMERCIAL',
    isPrimary: true,
    pages: ['/services', '/'],
  },
  {
    keyword: 'web development company',
    searchVolume: 27100,
    difficulty: 70,
    cpc: 10.00,
    intent: 'COMMERCIAL',
    isPrimary: true,
    pages: ['/services', '/'],
  },
  {
    keyword: 'custom website development',
    searchVolume: 4400,
    difficulty: 65,
    cpc: 14.25,
    intent: 'COMMERCIAL',
    isPrimary: true,
    pages: ['/services'],
  },
];

const SECONDARY_KEYWORDS = [
  {
    keyword: 'affordable web design',
    searchVolume: 2900,
    difficulty: 58,
    cpc: 8.50,
    intent: 'COMMERCIAL',
    isPrimary: false,
    pages: ['/services'],
  },
  {
    keyword: 'responsive website design',
    searchVolume: 3600,
    difficulty: 62,
    cpc: 11.20,
    intent: 'INFORMATIONAL',
    isPrimary: false,
    pages: ['/services', '/portfolio'],
  },
  {
    keyword: 'web design portfolio',
    searchVolume: 1900,
    difficulty: 45,
    cpc: 5.80,
    intent: 'INFORMATIONAL',
    isPrimary: false,
    pages: ['/portfolio'],
  },
  {
    keyword: 'web development services near me',
    searchVolume: 1600,
    difficulty: 52,
    cpc: 15.40,
    intent: 'COMMERCIAL',
    isPrimary: false,
    pages: ['/services', '/contact'],
  },
  {
    keyword: 'professional website design',
    searchVolume: 2400,
    difficulty: 60,
    cpc: 9.75,
    intent: 'COMMERCIAL',
    isPrimary: false,
    pages: ['/services', '/'],
  },
  {
    keyword: 'ecommerce website development',
    searchVolume: 5200,
    difficulty: 68,
    cpc: 13.90,
    intent: 'COMMERCIAL',
    isPrimary: false,
    pages: ['/services'],
  },
];

export async function POST() {
  try {
    const allKeywords = [...PRIMARY_KEYWORDS, ...SECONDARY_KEYWORDS];
    
    // Check if keywords already exist
    const existingKeywords = await prisma.sEOKeyword.findMany({
      where: {
        keyword: {
          in: allKeywords.map(k => k.keyword),
        },
      },
    });

    if (existingKeywords.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Keywords already seeded',
        existing: existingKeywords.length,
      });
    }

    // Create all keywords
    const created = await Promise.all(
      allKeywords.map(keyword =>
        prisma.sEOKeyword.create({
          data: keyword,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: 'Keywords seeded successfully',
      created: created.length,
    });
  } catch (error) {
    console.error('Error seeding keywords:', error);
    return NextResponse.json(
      { error: 'Failed to seed keywords', details: (error as Error).message },
      { status: 500 }
    );
  }
}
