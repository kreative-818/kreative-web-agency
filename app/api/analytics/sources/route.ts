
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Get lead source analytics
    const scrapedLeads = await prisma.scrapedLead.groupBy({
      by: ['primarySource'],
      _count: {
        id: true,
      },
      _avg: {
        leadScore: true,
      },
    });

    const intentLeads = await prisma.intentLead.groupBy({
      by: ['utmSource'],
      _count: {
        id: true,
      },
      _avg: {
        leadScore: true,
      },
    });

    // Calculate conversion rates by source
    const sourceStats = await Promise.all(
      scrapedLeads.map(async (source) => {
        const converted = await prisma.scrapedLead.count({
          where: {
            primarySource: source.primarySource,
            status: 'CONVERTED',
          },
        });

        const contacted = await prisma.scrapedLead.count({
          where: {
            primarySource: source.primarySource,
            status: 'CONTACTED',
          },
        });

        const interested = await prisma.scrapedLead.count({
          where: {
            primarySource: source.primarySource,
            status: 'INTERESTED',
          },
        });

        return {
          source: source.primarySource,
          total: source._count.id,
          avgScore: Math.round(source._avg.leadScore || 0),
          converted,
          contacted,
          interested,
          conversionRate: source._count.id > 0 ? ((converted / source._count.id) * 100).toFixed(1) : '0',
        };
      })
    );

    // Get organic (SEO) leads from intent leads
    const organicLeads = intentLeads.filter(
      (lead) => lead.utmSource === 'organic' || lead.utmSource === null
    );

    const organicTotal = organicLeads.reduce((sum, lead) => sum + lead._count.id, 0);
    const organicAvgScore = organicLeads.length > 0
      ? Math.round(organicLeads.reduce((sum, lead) => sum + (lead._avg.leadScore || 0), 0) / organicLeads.length)
      : 0;

    // Add organic SEO to stats
    if (organicTotal > 0) {
      sourceStats.push({
        source: 'SEO',
        total: organicTotal,
        avgScore: organicAvgScore,
        converted: 0,
        contacted: 0,
        interested: 0,
        conversionRate: '0',
      });
    }

    // Get platform-specific analytics
    const platformStats = {
      google: await prisma.scrapedLead.count({ where: { foundOnGoogle: true } }),
      linkedin: await prisma.scrapedLead.count({ where: { foundOnLinkedin: true } }),
      facebook: await prisma.scrapedLead.count({ where: { foundOnFacebook: true } }),
      instagram: await prisma.scrapedLead.count({ where: { foundOnInstagram: true } }),
      tiktok: await prisma.scrapedLead.count({ where: { foundOnTiktok: true } }),
    };

    // Get recent activity
    const recentLeads = await prisma.scrapedLead.findMany({
      orderBy: { discoveredAt: 'desc' },
      take: 10,
      select: {
        id: true,
        businessName: true,
        primarySource: true,
        leadScore: true,
        leadCategory: true,
        discoveredAt: true,
      },
    });

    return NextResponse.json({
      sourceStats,
      platformStats,
      recentLeads,
      summary: {
        totalLeads: sourceStats.reduce((sum, s) => sum + s.total, 0),
        avgScore: Math.round(
          sourceStats.reduce((sum, s) => sum + s.avgScore * s.total, 0) /
            sourceStats.reduce((sum, s) => sum + s.total, 0)
        ),
        totalConverted: sourceStats.reduce((sum, s) => sum + s.converted, 0),
        totalContacted: sourceStats.reduce((sum, s) => sum + s.contacted, 0),
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
