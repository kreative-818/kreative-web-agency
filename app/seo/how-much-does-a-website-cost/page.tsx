
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, DollarSign, ArrowRight, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How Much Does a Website Cost? | Website Pricing Guide 2025',
  description: 'Wondering how much a website costs? Get transparent pricing for website design & development. From $79/month with no upfront costs. Compare options and save thousands.',
  keywords: 'how much does a website cost, website cost, website pricing, website design cost, how much to build a website, website development cost',
};

export default function WebsiteCostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Transparent Pricing Guide</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            How Much Does a
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Website Really Cost?
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Get clear, honest pricing for your website project. <strong className="text-white">From $79/month with zero upfront costs</strong> - 
            or choose from other options starting at $500 one-time.
          </p>

          <Link href="/get-quote">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-lg px-8">
              Get Custom Quote <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Answer */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Website Cost Breakdown 2025
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="bg-black/40 border border-gray-800 rounded-xl p-8 hover:border-green-500/50 transition-all">
                <h3 className="text-2xl font-bold text-white mb-4">{tier.name}</h3>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
                  {tier.price}
                </div>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex gap-4">
              <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Why Choose Monthly Pricing?</h3>
                <p className="text-gray-300">
                  Our $79-$149/month plans include hosting, SSL, maintenance, updates, and support - 
                  things that cost $500-$1,000/year with traditional websites. Plus, no huge upfront cost means you can start today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            What Affects Website Cost?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {costFactors.map((factor, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{factor.name}</h3>
                <p className="text-gray-300 mb-4">{factor.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">Basic:</span>
                  <span className="text-white font-semibold">{factor.basic}</span>
                  <span className="text-gray-400">Advanced:</span>
                  <span className="text-white font-semibold">{factor.advanced}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hidden Costs */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
            Watch Out for Hidden Costs
          </h2>
          <p className="text-gray-300 text-center mb-12">
            Many web design companies don't mention these ongoing expenses upfront:
          </p>

          <div className="bg-black/40 border border-red-500/30 rounded-lg p-8">
            <ul className="space-y-4">
              {hiddenCosts.map((cost, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="text-red-400 font-bold text-lg flex-shrink-0">{cost.cost}</div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{cost.name}</h4>
                    <p className="text-gray-400 text-sm">{cost.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Total Hidden Costs (Annual):</span>
                <span className="text-3xl font-bold text-red-400">$500-$2,000/year</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                💡 All of these are <strong className="text-green-400">included</strong> in our monthly plans
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get a custom quote for your project - transparent pricing, no surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-quote">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/get-started">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                Start at $79/month
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const pricingTiers = [
  {
    name: 'DIY Website',
    price: '$10-$50/mo',
    description: 'Using platforms like Wix, Squarespace, or WordPress.com',
    features: [
      'Limited customization',
      'Template-based design',
      'You build it yourself',
      'Basic features only',
      'Platform fees apply',
    ],
  },
  {
    name: 'Professional Monthly',
    price: '$79-$149/mo',
    description: 'Custom website with no upfront costs (Our recommended option)',
    features: [
      'Professional custom design',
      'Includes hosting & SSL',
      'Monthly updates included',
      'Technical support',
      'No surprise fees',
    ],
  },
  {
    name: 'One-Time Build',
    price: '$1,500-$10,000',
    description: 'Traditional agency model with large upfront payment',
    features: [
      'Custom design & development',
      'Full ownership',
      'Large initial investment',
      'Ongoing costs extra',
      '2-3 month timeline',
    ],
  },
];

const costFactors = [
  {
    name: 'Number of Pages',
    description: 'More pages mean more design, content, and development work.',
    basic: '5-10 pages',
    advanced: '20+ pages',
  },
  {
    name: 'Custom Features',
    description: 'Special functionality like booking systems, calculators, or integrations.',
    basic: 'Contact forms',
    advanced: 'Custom tools',
  },
  {
    name: 'E-Commerce',
    description: 'Selling products online adds complexity and payment processing.',
    basic: 'Not needed',
    advanced: '$500-$3,000',
  },
  {
    name: 'Design Complexity',
    description: 'Custom animations, illustrations, and interactive elements.',
    basic: 'Template-based',
    advanced: 'Fully custom',
  },
];

const hiddenCosts = [
  {
    name: 'Web Hosting',
    cost: '$10-$50/mo',
    description: 'Where your website files are stored and served from',
  },
  {
    name: 'SSL Certificate',
    cost: '$50-$200/yr',
    description: 'Required for security and Google ranking',
  },
  {
    name: 'Domain Name',
    cost: '$15-$50/yr',
    description: 'Your website address (yourname.com)',
  },
  {
    name: 'Updates & Maintenance',
    cost: '$50-$200/mo',
    description: 'Software updates, security patches, and bug fixes',
  },
  {
    name: 'Content Updates',
    cost: '$50-$150/hr',
    description: 'Making changes to text, images, or layout',
  },
  {
    name: 'Email Hosting',
    cost: '$5-$15/mo',
    description: 'Professional email (you@yourcompany.com)',
  },
];
