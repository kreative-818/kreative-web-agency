
import Link from 'next/link';
import { FileText, Rocket, Brain, DollarSign, Users, Zap, BookOpen, TrendingUp } from 'lucide-react';

const docCategories = [
  {
    title: "Quick Start Computer Usedes",
    description: "Get up and running fast with these essential Computer Usedes",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    docs: [
      { slug: "quick-start", title: "Quick Start Guide", description: "Get started in minutes" },
      { slug: "day-1-takeover", title: "Day 1 Takeover Checklist", description: "Your first day action plan" },
      { slug: "executive-summary", title: "Executive Summary", description: "Business overview at a glance" },
    ]
  },
  {
    title: "Complete Business SOPs",
    description: "Comprehensive operational procedures and systems",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    docs: [
      { slug: "complete-business-sop", title: "Complete Business SOP", description: "Full operational manual" },
      { slug: "business-acquisition-deck", title: "Business Acquisition Deck", description: "For potential buyers/partners" },
    ]
  },
  {
    title: "Marketing & Lead Generation",
    description: "Strategies to attract and convert customers",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    docs: [
      { slug: "marketing-strategy", title: "Marketing Strategy Complete Guide", description: "Comprehensive marketing playbook" },
      { slug: "low-budget-marketing", title: "Low Budget Marketing Playbook", description: "$100-300/month strategy" },
      { slug: "organic-marketing", title: "Organic Marketing Implementation", description: "Free traffic strategies" },
      { slug: "facebook-ads-setup", title: "Facebook Ads Setup Guide", description: "Paid advertising mastery" },
      { slug: "google-ai-ads", title: "Google AI Ads Strategy", description: "PPC campaign guide" },
      { slug: "craigslist-ads", title: "Craigslist Ad Creator Guide", description: "Free local advertising" },
    ]
  },
  {
    title: "AI & Automation",
    description: "Leverage AI to scale your operations",
    icon: Brain,
    color: "from-violet-500 to-purple-500",
    docs: [
      { slug: "ai-sales-agent", title: "AI Sales Agent Guide", description: "Automated sales conversations" },
      { slug: "quo-sona-complete", title: "Quo Sona Complete Guide", description: "Phone AI setup" },
      { slug: "quo-sona-quick", title: "Quo Sona Quick Guide", description: "Fast phone AI reference" },
      { slug: "seo-social-automation", title: "SEO & Social Media Automation", description: "Content automation" },
      { slug: "multi-platform-lead-scraper", title: "Multi-Platform Lead Scraper", description: "Automated lead generation" },
    ]
  },
  {
    title: "Pricing & Business Model",
    description: "Monetization strategies and pricing structures",
    icon: DollarSign,
    color: "from-yellow-500 to-orange-500",
    docs: [
      { slug: "pricing-restructure", title: "Pricing Restructure Strategy", description: "Optimize your pricing" },
      { slug: "97-dollar-website", title: "$97 Website Business Strategy", description: "Low-ticket offer strategy" },
      { slug: "breakthrough-mindset", title: "Breakthrough Mindset & Strategy", description: "Overcome limiting beliefs" },
      { slug: "phone-service-reselling", title: "Phone Service Reselling Guide", description: "Additional revenue stream" },
    ]
  },
  {
    title: "Client Management",
    description: "Deliver exceptional client experiences",
    icon: Users,
    color: "from-pink-500 to-rose-500",
    docs: [
      { slug: "client-portal", title: "Client Portal Implementation", description: "White-label client experience" },
    ]
  },
  {
    title: "Content & SEO",
    description: "Organic traffic and content strategies",
    icon: FileText,
    color: "from-indigo-500 to-blue-500",
    docs: [
      { slug: "blog-content-system", title: "Blog Content System Guide", description: "Automated blogging" },
      { slug: "blog-quick-start", title: "Blog Quick Start", description: "Get blogging fast" },
      { slug: "phase-1-blog", title: "Phase 1 Blog System", description: "Initial blog setup" },
    ]
  },
  {
    title: "Technical Implementation",
    description: "System architecture and integration Computer Usedes",
    icon: Zap,
    color: "from-cyan-500 to-teal-500",
    docs: [
      { slug: "implementation-plan", title: "Implementation Plan", description: "Technical roadmap" },
      { slug: "phone-integration", title: "Phone Integration Plan", description: "Call system setup" },
      { slug: "white-label-ai-builder", title: "White Label AI Builder", description: "Reseller platform guide" },
    ]
  },
];

export default function DocsHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Kreative Intelligence
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
              Complete Business Documentation
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to run, scale, and sell a million-dollar web agency powered by AI
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          ← Back to Home
        </Link>
      </div>

      {/* Documentation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {docCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Docs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.docs.map((doc, docIdx) => (
                    <Link
                      key={docIdx}
                      href={`/docs/${doc.slug}`}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-transparent hover:ring-2 hover:ring-blue-500"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                      
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {doc.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {doc.description}
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                        Read guide
                        <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Ready to Launch Your Agency?</h3>
          <p className="text-lg mb-6 opacity-90">
            Follow the Quick Start Guide to get up and running in under 1 hour
          </p>
          <Link
            href="/docs/quick-start"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
