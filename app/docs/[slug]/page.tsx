export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Download, Home } from 'lucide-react';

// Map of slugs to actual markdown file names
const docMap: Record<string, string> = {
  'quick-start': 'QUICK_START.md',
  'day-1-takeover': 'DAY_1_TAKEOVER_CHECKLIST.md',
  'executive-summary': 'EXECUTIVE_SUMMARY.md',
  'complete-business-sop': 'KREATIVE_INTELLIGENCE_COMPLETE_BUSINESS_SOP.md',
  'business-acquisition-deck': 'BUSINESS_ACQUISITION_DECK.md',
  'marketing-strategy': 'MARKETING_STRATEGY_COMPLETE_GUIDE.md',
  'low-budget-marketing': 'LOW_BUDGET_MARKETING_PLAYBOOK.md',
  'organic-marketing': 'ORGANIC_MARKETING_IMPLEMENTATION_PLAN.md',
  'facebook-ads-setup': 'FACEBOOK_ADS_SETUP_GUIDE.md',
  'google-ai-ads': 'GOOGLE_AI_ADS_STRATEGY.md',
  'craigslist-ads': 'CRAIGSLIST_AD_CREATOR_GUIDE.md',
  'ai-sales-agent': 'AI_SALES_AGENT_GUIDE.md',
  'quo-sona-complete': 'QUO_SONA_COMPLETE_GUIDE.md',
  'quo-sona-quick': 'QUO_SONA_QUICK_GUIDE.md',
  'seo-social-automation': 'SEO_AND_SOCIAL_MEDIA_AUTOMATION_COMPLETE.md',
  'multi-platform-lead-scraper': 'Multi-Platform_Lead_Scraper_Architecture.md',
  'pricing-restructure': 'PRICING_RESTRUCTURE_STRATEGY.md',
  '97-dollar-website': '97_DOLLAR_WEBSITE_BUSINESS_STRATEGY.md',
  'breakthrough-mindset': 'BREAKTHROUGH_MINDSET_AND_STRATEGY_GUIDE.md',
  'phone-service-reselling': 'PHONE_SERVICE_RESELLING_GUIDE.md',
  'client-portal': 'CLIENT_PORTAL_IMPLEMENTATION_GUIDE.md',
  'blog-content-system': 'BLOG_CONTENT_SYSTEM_GUIDE.md',
  'blog-quick-start': 'BLOG_QUICK_START.md',
  'phase-1-blog': 'PHASE_1_BLOG_SYSTEM_GUIDE.md',
  'implementation-plan': 'IMPLEMENTATION_PLAN.md',
  'phone-integration': 'PHONE_INTEGRATION_PLAN.md',
  'white-label-ai-builder': 'WHITE_LABEL_AI_BUILDER_GUIDE.md',
};

export async function generateStaticParams() {
  return Object.keys(docMap).map((slug) => ({
    slug,
  }));
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filename = docMap[slug];

  if (!filename) {
    notFound();
  }

  // Read the markdown file
  let content = '';
  let title = '';
  
  try {
    const filePath = join('/home/ubuntu', filename);
    content = readFileSync(filePath, 'utf-8');
    
    // Extract title from the first # heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    title = titleMatch ? titleMatch[1] : slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  } catch (error) {
    notFound();
  }

  // Get PDF download link (assuming PDFs exist with same base name)
  const pdfFilename = filename.replace('.md', '.pdf');
  const pdfExists = true; // We'll assume they exist based on the file listing

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/docs"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">All Docs</span>
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
            </div>
            
            {pdfExists && (
              <a
                href={`/${pdfFilename}`}
                download
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            {title}
          </h1>

          {/* Markdown Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:text-gray-900 dark:prose-h1:text-white
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-gray-900 dark:prose-h2:text-white prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-gray-900 dark:prose-h3:text-white
            prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-gray-800 dark:prose-h4:text-gray-200
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
            prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
            prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-2
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic
            prose-table:border-collapse prose-table:w-full
            prose-th:bg-gray-100 dark:prose-th:bg-gray-900 prose-th:p-3 prose-th:text-left prose-th:font-semibold
            prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:p-3
            prose-img:rounded-lg prose-img:shadow-md
          ">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </article>

        {/* Navigation Footer */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
