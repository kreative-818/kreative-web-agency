
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Home, Search, MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Real Estate Website Design | IDX Websites for Realtors & Agents',
  description: 'Professional real estate website design with IDX integration, property search, lead capture, and CRM. Perfect for realtors, brokers, and real estate agencies. Starting at $149/month.',
  keywords: 'real estate website design, realtor website, IDX website, real estate agent website, property listing website, MLS integration',
};

export default function RealEstateWebsiteDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Real Estate Website Specialists</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Real Estate Website Design
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Built for Agents & Brokers
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional websites with IDX integration, property search, lead capture, and CRM tools. 
            <strong className="text-white"> Generate more leads and close more deals.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/get-started">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8">
                Get Your Website <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                View Examples
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>IDX Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Lead Capture</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Mobile Optimized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Powerful Features for Real Estate Professionals
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {realEstateFeatures.map((feature, index) => (
              <div key={index} className="bg-black/40 border border-gray-800 rounded-lg p-6 hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Choose Your Plan
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Agent</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$149</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {agentFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/get-started">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-2 border-blue-500 rounded-xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Broker</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$299</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {brokerFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/get-started">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Generating More Leads Today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get a professional real estate website that works 24/7 to capture leads and showcase your listings.
          </p>
          <Link href="/get-started">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const realEstateFeatures = [
  {
    icon: Search,
    title: 'IDX Integration',
    description: 'Automatically sync MLS listings to your website with full search functionality.',
  },
  {
    icon: MapPin,
    title: 'Property Search',
    description: 'Advanced search filters by price, location, beds, baths, and more.',
  },
  {
    icon: Home,
    title: 'Lead Capture Forms',
    description: 'Convert visitors into leads with strategically placed contact forms.',
  },
  {
    icon: Check,
    title: 'CRM Integration',
    description: 'Automatically add new leads to your CRM or email marketing system.',
  },
  {
    icon: ArrowRight,
    title: 'Mobile Responsive',
    description: 'Perfect experience on all devices - desktop, tablet, and mobile.',
  },
  {
    icon: Home,
    title: 'Virtual Tours',
    description: 'Embed 360° virtual tours and video walkthroughs of properties.',
  },
];

const agentFeatures = [
  'Custom agent website',
  'IDX MLS integration',
  'Property search functionality',
  'Lead capture forms',
  'Mobile-responsive design',
  'Featured listings showcase',
  'Neighborhood pages',
  'Blog for local content',
  'SEO optimization',
  'SSL certificate',
];

const brokerFeatures = [
  'Everything in Agent, plus:',
  'Multi-agent profiles',
  'Team management system',
  'Advanced CRM integration',
  'Custom domain email',
  'Priority support',
  'Advanced analytics',
  'Marketing automation',
  'Custom branding',
  'Unlimited listings',
];
