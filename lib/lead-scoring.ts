
// Intent-based lead scoring algorithm

type IntentLeadData = {
  budgetRange: string;
  timeline: string;
  projectType: string;
  hasBusinessName: boolean;
  hasWebsite: boolean;
  phoneType: string;
  formCompletionTime?: number; // seconds
};

export function calculateIntentLeadScore(data: IntentLeadData): {
  score: number;
  category: 'HOT' | 'WARM' | 'COLD' | 'DISQUALIFIED';
  qualificationStatus: 'QUALIFIED' | 'DISQUALIFIED' | 'PENDING';
  disqualifyReason?: string;
} {
  let score = 0;

  // Budget scoring (max 40 points)
  const budgetScores: Record<string, number> = {
    '10000+': 40,
    '5000-10000': 35,
    '2500-5000': 30,
    '1000-2500': 20,
    '500-1000': 10,
    'under-500': 0
  };
  score += budgetScores[data.budgetRange] || 0;

  // Disqualify if budget too low
  if (data.budgetRange === 'under-500') {
    return {
      score: 0,
      category: 'DISQUALIFIED',
      qualificationStatus: 'DISQUALIFIED',
      disqualifyReason: 'Budget too low'
    };
  }

  // Timeline/Urgency scoring (max 30 points)
  const timelineScores: Record<string, number> = {
    'URGENT': 30,
    '1-2_WEEKS': 25,
    '1_MONTH': 20,
    '2-3_MONTHS': 10,
    'FLEXIBLE': 5
  };
  score += timelineScores[data.timeline] || 0;

  // Project type scoring (max 15 points)
  const projectScores: Record<string, number> = {
    'ECOMMERCE': 15,
    'CUSTOM_APP': 15,
    'NEW_WEBSITE': 12,
    'REDESIGN': 10,
    'LANDING_PAGE': 5,
    'OTHER': 5
  };
  score += projectScores[data.projectType] || 0;

  // Business quality indicators (max 10 points)
  if (data.hasBusinessName) score += 5;
  if (data.hasWebsite) score += 5;

  // Phone type (max 5 points)
  if (data.phoneType === 'MOBILE') score += 5;
  else if (data.phoneType === 'VOIP') score += 3;
  else if (data.phoneType === 'LANDLINE') score += 0; // Landlines are problematic for SMS

  // Form completion speed bonus (engaged users)
  if (data.formCompletionTime) {
    if (data.formCompletionTime < 120) score += 5; // Completed in under 2 minutes
    else if (data.formCompletionTime < 300) score += 2; // Under 5 minutes
  }

  // Disqualify landline-only contacts (can't receive SMS)
  if (data.phoneType === 'LANDLINE') {
    return {
      score: Math.max(score - 20, 0), // Penalty for landline
      category: 'COLD',
      qualificationStatus: 'PENDING',
      disqualifyReason: 'Landline only - cannot receive SMS'
    };
  }

  // Categorize lead
  let category: 'HOT' | 'WARM' | 'COLD' | 'DISQUALIFIED';
  let qualificationStatus: 'QUALIFIED' | 'DISQUALIFIED' | 'PENDING';

  if (score >= 70) {
    category = 'HOT';
    qualificationStatus = 'QUALIFIED';
  } else if (score >= 50) {
    category = 'WARM';
    qualificationStatus = 'QUALIFIED';
  } else if (score >= 30) {
    category = 'COLD';
    qualificationStatus = 'PENDING';
  } else {
    category = 'DISQUALIFIED';
    qualificationStatus = 'DISQUALIFIED';
  }

  return {
    score,
    category,
    qualificationStatus
  };
}

export function getBudgetAmount(budgetRange: string): number {
  const amounts: Record<string, number> = {
    '10000+': 10000,
    '5000-10000': 7500,
    '2500-5000': 3750,
    '1000-2500': 1750,
    '500-1000': 750,
    'under-500': 250
  };
  return amounts[budgetRange] || 0;
}

export function getUrgencyScore(timeline: string): number {
  const scores: Record<string, number> = {
    'URGENT': 100,
    '1-2_WEEKS': 80,
    '1_MONTH': 60,
    '2-3_MONTHS': 40,
    'FLEXIBLE': 20
  };
  return scores[timeline] || 0;
}

// Lead scoring for scraped leads
interface ScrapedLeadData {
  hasWebsite: boolean;
  websiteScore?: number;
  googleRating?: number | null;
  googleReviews?: number | null;
  hasPhone: boolean;
  hasEmail: boolean;
  industry?: string | null;
}

export function calculateLeadScore(data: ScrapedLeadData): number {
  let score = 0;

  // Website quality (40 points max)
  if (data.hasWebsite) {
    if (data.websiteScore) {
      // Lower website score = more potential for improvement = higher lead score
      if (data.websiteScore < 50) {
        score += 40; // Poor website = great opportunity
      } else if (data.websiteScore < 70) {
        score += 25; // Decent website, some opportunities
      } else {
        score += 10; // Good website, less need for our services
      }
    } else {
      score += 20; // Has website but couldn't analyze
    }
  } else {
    score += 50; // No website = huge opportunity
  }

  // Google presence (30 points max)
  if (data.googleRating) {
    if (data.googleRating >= 4.0) {
      score += 15; // Good reviews = quality business
    } else if (data.googleRating >= 3.0) {
      score += 10;
    } else {
      score += 5;
    }
  }

  if (data.googleReviews) {
    if (data.googleReviews > 50) {
      score += 15; // Established business
    } else if (data.googleReviews > 20) {
      score += 10;
    } else if (data.googleReviews > 5) {
      score += 5;
    }
  }

  // Contact info (20 points max)
  if (data.hasPhone) score += 10;
  if (data.hasEmail) score += 10;

  // Industry (10 points max)
  const highValueIndustries = ['real estate', 'restaurant', 'dental', 'medical', 'legal', 'contractor'];
  if (data.industry && highValueIndustries.some(ind => data.industry?.toLowerCase().includes(ind))) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}
