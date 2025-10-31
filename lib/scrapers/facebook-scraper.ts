
/**
 * Facebook Business Page Scraper
 * Scrapes Facebook business pages to find local businesses
 */

interface FacebookBusiness {
  name: string;
  category?: string;
  location?: string;
  website?: string;
  facebookPageId: string;
  facebookUrl: string;
  phone?: string;
  email?: string;
  likes?: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
}

export async function scrapeFacebookBusinesses(
  searchQuery: string,
  location: string,
  limit: number = 20
): Promise<FacebookBusiness[]> {
  const businesses: FacebookBusiness[] = [];

  try {
    // Facebook Graph API approach (requires app + access token)
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.log('Facebook access token not configured');
      return businesses;
    }

    // Search for pages using Facebook Graph API
    const searchUrl = `https://graph.facebook.com/v18.0/pages/search?type=place&center=${encodeURIComponent(location)}&distance=25000&q=${encodeURIComponent(searchQuery)}&fields=name,category,location,website,phone,emails,fan_count,overall_star_rating,rating_count,about&limit=${limit}&access_token=${accessToken}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      for (const page of data.data) {
        businesses.push({
          name: page.name,
          category: page.category,
          location: page.location ? `${page.location.city}, ${page.location.state}` : undefined,
          website: page.website,
          facebookPageId: page.id,
          facebookUrl: `https://facebook.com/${page.id}`,
          phone: page.phone,
          email: page.emails && page.emails.length > 0 ? page.emails[0] : undefined,
          likes: page.fan_count,
          rating: page.overall_star_rating,
          reviewCount: page.rating_count,
          description: page.about,
        });
      }
    }

    return businesses;
  } catch (error) {
    console.error('Facebook scraping error:', error);
    return businesses;
  }
}

export async function enrichFacebookData(facebookPageId: string) {
  try {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    
    if (!accessToken) {
      return null;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${facebookPageId}?fields=name,category,location,website,phone,emails,fan_count,overall_star_rating,rating_count,about,posts.limit(5)&access_token=${accessToken}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Facebook enrichment error:', error);
    return null;
  }
}
