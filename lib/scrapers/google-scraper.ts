
/**
 * Google Places Scraper
 * Uses Google Places API to find local businesses
 */

interface GoogleBusiness {
  name: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  placeId: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
}

export async function scrapeGooglePlaces(
  searchQuery: string,
  location: string,
  limit: number = 20
): Promise<GoogleBusiness[]> {
  const businesses: GoogleBusiness[] = [];
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.log('Google Places API key not configured');
    return businesses;
  }

  try {
    // Step 1: Text search to find businesses
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery + ' ' + location)}&key=${apiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK') {
      console.error('Google Places API error:', searchData.status);
      return businesses;
    }

    // Step 2: Get details for each place
    const places = searchData.results.slice(0, limit);
    
    for (const place of places) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,formatted_address,address_components,rating,user_ratings_total,types&key=${apiKey}`;
      
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      if (detailsData.status === 'OK') {
        const details = detailsData.result;
        
        // Extract city and state from address components
        let city = '';
        let state = '';
        
        if (details.address_components) {
          for (const component of details.address_components) {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
          }
        }

        businesses.push({
          name: details.name,
          phone: details.formatted_phone_number,
          website: details.website,
          address: details.formatted_address,
          city,
          state,
          placeId: place.place_id,
          rating: details.rating,
          reviewCount: details.user_ratings_total,
          category: details.types?.[0],
        });
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return businesses;
  } catch (error) {
    console.error('Google Places scraping error:', error);
    return businesses;
  }
}
