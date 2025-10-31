
/**
 * Website Analyzer
 * Analyzes websites for quality, speed, and SEO
 */

interface WebsiteAnalysis {
  overallScore: number;
  mobileFriendly: boolean;
  issues: string[];
  hasSSL?: boolean;
  loadTime?: number;
  seoScore?: number;
}

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis | null> {
  try {
    // Basic analysis - in production, you'd use tools like:
    // - Google PageSpeed Insights API
    // - Lighthouse API
    // - SEMrush API
    
    const issues: string[] = [];
    let score = 100;

    // Check if HTTPS
    const hasSSL = url.startsWith('https://');
    if (!hasSSL) {
      issues.push('No SSL certificate');
      score -= 20;
    }

    // Basic checks
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      issues.push('Website not accessible');
      score -= 30;
    }

    // Check for mobile viewport meta tag
    const htmlResponse = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });
    const html = await htmlResponse.text();
    
    const hasMobileViewport = html.includes('viewport') && html.includes('width=device-width');
    if (!hasMobileViewport) {
      issues.push('Not mobile-friendly');
      score -= 25;
    }

    // Check for basic SEO elements
    const hasTitle = /<title>.*<\/title>/i.test(html);
    const hasDescription = /meta.*name="description"/i.test(html);
    
    if (!hasTitle) {
      issues.push('Missing title tag');
      score -= 15;
    }
    
    if (!hasDescription) {
      issues.push('Missing meta description');
      score -= 10;
    }

    return {
      overallScore: Math.max(0, score),
      mobileFriendly: hasMobileViewport,
      issues,
      hasSSL,
      seoScore: hasTitle && hasDescription ? 70 : 40,
    };
  } catch (error) {
    console.error('Website analysis error:', error);
    return null;
  }
}
