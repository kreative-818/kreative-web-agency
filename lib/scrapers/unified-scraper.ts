
/**
 * Unified Multi-Platform Scraper
 * Orchestrates scraping across all platforms and deduplicates results
 */

import { scrapeGooglePlaces } from './google-scraper';
import { scrapeLinkedInBusinesses } from './linkedin-scraper';
import { scrapeFacebookBusinesses } from './facebook-scraper';
import { scrapeInstagramBusinesses } from './instagram-scraper';
import { scrapeTikTokBusinesses } from './tiktok-scraper';
import { prisma } from '../db';
import { analyzeWebsite } from '../website-analyzer';
import { calculateLeadScore } from '../lead-scoring';

interface UnifiedScraperOptions {
  searchQuery: string;
  location: string;
  city: string;
  state: string;
  platforms: ('google' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok')[];
  limit?: number;
  saveToDatabase?: boolean;
}

interface ScrapedBusiness {
  businessName: string;
  industry?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  primarySource: string;
  foundOn: {
    google?: boolean;
    linkedin?: boolean;
    facebook?: boolean;
    instagram?: boolean;
    tiktok?: boolean;
  };
  socialProfiles: {
    googlePlaceId?: string;
    linkedinUrl?: string;
    facebookPageId?: string;
    instagramUsername?: string;
    tiktokUsername?: string;
  };
  metrics: {
    googleRating?: number;
    googleReviews?: number;
    facebookLikes?: number;
    instagramFollowers?: number;
    tiktokFollowers?: number;
  };
}

export async function scrapeAllPlatforms(
  options: UnifiedScraperOptions
): Promise<{ businesses: ScrapedBusiness[]; summary: any }> {
  const {
    searchQuery,
    location,
    city,
    state,
    platforms,
    limit = 20,
    saveToDatabase = true,
  } = options;

  const results: ScrapedBusiness[] = [];
  const summary = {
    total: 0,
    byPlatform: {} as Record<string, number>,
    duplicates: 0,
    saved: 0,
    errors: [] as string[],
  };

  console.log(`🚀 Starting unified scrape for "${searchQuery}" in ${location}`);

  // Scrape each platform
  for (const platform of platforms) {
    try {
      console.log(`📡 Scraping ${platform.toUpperCase()}...`);
      
      let platformResults: any[] = [];

      switch (platform) {
        case 'google':
          platformResults = await scrapeGooglePlaces(searchQuery, location, limit);
          break;
        case 'linkedin':
          platformResults = await scrapeLinkedInBusinesses(searchQuery, location, limit);
          break;
        case 'facebook':
          platformResults = await scrapeFacebookBusinesses(searchQuery, location, limit);
          break;
        case 'instagram':
          platformResults = await scrapeInstagramBusinesses(searchQuery, location, limit);
          break;
        case 'tiktok':
          platformResults = await scrapeTikTokBusinesses(searchQuery, location, limit);
          break;
      }

      summary.byPlatform[platform] = platformResults.length;
      console.log(`✅ Found ${platformResults.length} businesses on ${platform}`);

      // Convert platform-specific results to unified format
      for (const result of platformResults) {
        const unified = normalizeBusinessData(result, platform);
        results.push(unified);
      }
    } catch (error) {
      const errorMsg = `Error scraping ${platform}: ${error}`;
      console.error(errorMsg);
      summary.errors.push(errorMsg);
    }
  }

  // Deduplicate results
  const deduped = deduplicateBusinesses(results);
  summary.duplicates = results.length - deduped.length;
  summary.total = deduped.length;

  console.log(`🔄 Deduplicated: ${results.length} → ${deduped.length} unique businesses`);

  // Save to database
  if (saveToDatabase) {
    for (const business of deduped) {
      try {
        // Analyze website if available
        let websiteAnalysis = null;
        if (business.websiteUrl) {
          websiteAnalysis = await analyzeWebsite(business.websiteUrl);
        }

        // Calculate lead score
        const leadScore = calculateLeadScore({
          hasWebsite: !!business.websiteUrl,
          websiteScore: websiteAnalysis?.overallScore || 0,
          googleRating: business.metrics.googleRating,
          googleReviews: business.metrics.googleReviews,
          hasPhone: !!business.phone,
          hasEmail: !!business.email,
          industry: business.industry,
        });

        // Save to database
        await prisma.scrapedLead.upsert({
          where: {
            businessName_phone_email: {
              businessName: business.businessName,
              phone: business.phone || '',
              email: business.email || '',
            },
          },
          create: {
            businessName: business.businessName,
            industry: business.industry,
            phone: business.phone,
            email: business.email,
            websiteUrl: business.websiteUrl,
            address: business.address,
            city: business.city || city,
            state: business.state || state,
            
            // Source tracking
            primarySource: business.primarySource,
            sourceChannel: 'SCRAPER',
            
            // Platform flags
            foundOnGoogle: business.foundOn.google || false,
            foundOnLinkedin: business.foundOn.linkedin || false,
            foundOnFacebook: business.foundOn.facebook || false,
            foundOnInstagram: business.foundOn.instagram || false,
            foundOnTiktok: business.foundOn.tiktok || false,
            
            // Social profiles
            googlePlaceId: business.socialProfiles.googlePlaceId,
            linkedinUrl: business.socialProfiles.linkedinUrl,
            facebookPageId: business.socialProfiles.facebookPageId,
            instagramUsername: business.socialProfiles.instagramUsername,
            tiktokUsername: business.socialProfiles.tiktokUsername,
            
            // Metrics
            googleRating: business.metrics.googleRating,
            googleReviewsCount: business.metrics.googleReviews,
            facebookLikes: business.metrics.facebookLikes,
            instagramFollowers: business.metrics.instagramFollowers,
            tiktokFollowers: business.metrics.tiktokFollowers,
            
            // Website analysis
            hasWebsite: !!business.websiteUrl,
            websiteScore: websiteAnalysis?.overallScore,
            mobileFriendly: websiteAnalysis?.mobileFriendly,
            websiteIssues: websiteAnalysis?.issues || [],
            
            // Lead scoring
            leadScore,
            leadCategory: leadScore >= 70 ? 'HOT' : leadScore >= 50 ? 'WARM' : 'COLD',
          },
          update: {
            // Update platform flags if found on multiple platforms
            foundOnGoogle: business.foundOn.google || undefined,
            foundOnLinkedin: business.foundOn.linkedin || undefined,
            foundOnFacebook: business.foundOn.facebook || undefined,
            foundOnInstagram: business.foundOn.instagram || undefined,
            foundOnTiktok: business.foundOn.tiktok || undefined,
            
            // Update social profiles
            linkedinUrl: business.socialProfiles.linkedinUrl || undefined,
            facebookPageId: business.socialProfiles.facebookPageId || undefined,
            instagramUsername: business.socialProfiles.instagramUsername || undefined,
            tiktokUsername: business.socialProfiles.tiktokUsername || undefined,
          },
        });

        summary.saved++;
      } catch (error) {
        console.error(`Error saving business ${business.businessName}:`, error);
        summary.errors.push(`Failed to save ${business.businessName}`);
      }
    }
  }

  console.log(`✅ Saved ${summary.saved} businesses to database`);

  return { businesses: deduped, summary };
}

function normalizeBusinessData(data: any, platform: string): ScrapedBusiness {
  const business: ScrapedBusiness = {
    businessName: data.name || data.businessName,
    primarySource: platform.toUpperCase(),
    foundOn: {
      [platform]: true,
    },
    socialProfiles: {},
    metrics: {},
  };

  // Platform-specific normalization
  switch (platform) {
    case 'google':
      business.phone = data.phone;
      business.websiteUrl = data.website;
      business.address = data.address;
      business.city = data.city;
      business.state = data.state;
      business.socialProfiles.googlePlaceId = data.placeId;
      business.metrics.googleRating = data.rating;
      business.metrics.googleReviews = data.reviewCount;
      break;
      
    case 'linkedin':
      business.industry = data.industry;
      business.websiteUrl = data.website;
      business.socialProfiles.linkedinUrl = data.linkedinUrl;
      break;
      
    case 'facebook':
      business.industry = data.category;
      business.phone = data.phone;
      business.email = data.email;
      business.websiteUrl = data.website;
      business.socialProfiles.facebookPageId = data.facebookPageId;
      business.metrics.facebookLikes = data.likes;
      break;
      
    case 'instagram':
      business.email = data.email;
      business.phone = data.phone;
      business.websiteUrl = data.website;
      business.socialProfiles.instagramUsername = data.username;
      business.metrics.instagramFollowers = data.followers;
      break;
      
    case 'tiktok':
      business.email = data.email;
      business.websiteUrl = data.website;
      business.socialProfiles.tiktokUsername = data.username;
      business.metrics.tiktokFollowers = data.followers;
      break;
  }

  return business;
}

function deduplicateBusinesses(businesses: ScrapedBusiness[]): ScrapedBusiness[] {
  const seen = new Map<string, ScrapedBusiness>();

  for (const business of businesses) {
    // Create a unique key based on business name and contact info
    const key = [
      business.businessName.toLowerCase().trim(),
      business.phone?.replace(/\D/g, ''),
      business.email?.toLowerCase(),
      business.websiteUrl?.replace(/https?:\/\/(www\.)?/, ''),
    ]
      .filter(Boolean)
      .join('|');

    if (seen.has(key)) {
      // Merge data if business already exists
      const existing = seen.get(key)!;
      existing.foundOn = { ...existing.foundOn, ...business.foundOn };
      existing.socialProfiles = { ...existing.socialProfiles, ...business.socialProfiles };
      existing.metrics = { ...existing.metrics, ...business.metrics };
      
      // Fill in missing data
      existing.phone = existing.phone || business.phone;
      existing.email = existing.email || business.email;
      existing.websiteUrl = existing.websiteUrl || business.websiteUrl;
      existing.address = existing.address || business.address;
      existing.city = existing.city || business.city;
      existing.state = existing.state || business.state;
      existing.industry = existing.industry || business.industry;
    } else {
      seen.set(key, business);
    }
  }

  return Array.from(seen.values());
}
