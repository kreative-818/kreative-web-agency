export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'

import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Charlotte Web Design | Professional Website Design in Charlotte, NC',
  description: 'Top-rated web design agency in Charlotte, NC. Custom websites, web applications, and digital solutions for Charlotte businesses. Starting at $79/month. Free consultation available.',
  keywords: 'charlotte web design, web design charlotte nc, charlotte website design, web developer charlotte, charlotte nc web design company',
};

export default function CharlotteWebDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Serving Charlotte & Surrounding Areas</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Charlotte Web Design
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Built for Local Businesses
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional web design and development services for Charlotte, NC businesses. 
            Custom websites that drive results. <strong className="text-white">Starting at just $79/month.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/get-started">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8">
                Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/get-quote">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Phone className="mr-2 w-4 h-4" />
                Free Consultation
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Local Charlotte Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Same-Day Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>No Upfront Costs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Charlotte-Specific Value Prop */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Charlotte Businesses Choose Us
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charlotteFeatures.map((feature, index) => (
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

      {/* Charlotte Industries We Serve */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
            Industries We Serve in Charlotte
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            We specialize in creating custom websites for Charlotte's diverse business community
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {charlotteIndustries.map((industry, index) => (
              <div key={index} className="bg-black/40 border border-gray-800 rounded-lg p-6 text-center hover:border-blue-500/50 transition-all">
                <h3 className="text-lg font-semibold text-white mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-400">{industry.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Affordable Web Design for Charlotte Businesses
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Professional websites without the upfront costs
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-black/40 border border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
              <div className="text-4xl font-bold text-white mb-4">$79<span className="text-lg text-gray-400">/mo</span></div>
              <p className="text-gray-400 text-sm mb-6">Perfect for small businesses</p>
              <ul className="space-y-2 text-left text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  5-page website
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Mobile responsive
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Contact form
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  SEO basics
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-2 border-blue-500 rounded-xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <div className="text-4xl font-bold text-white mb-4">$149<span className="text-lg text-gray-400">/mo</span></div>
              <p className="text-gray-400 text-sm mb-6">For growing businesses</p>
              <ul className="space-y-2 text-left text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  10-page website
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Custom design
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Advanced SEO
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  E-commerce ready
                </li>
              </ul>
            </div>

            <div className="bg-black/40 border border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-4">Custom</div>
              <p className="text-gray-400 text-sm mb-6">For established businesses</p>
              <ul className="space-y-2 text-left text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Unlimited pages
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Custom features
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Priority support
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Dedicated manager
                </li>
              </ul>
            </div>
          </div>

          <Link href="/get-started" className="inline-block mt-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Grow Your Charlotte Business Online?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's create a website that helps your business stand out in the Charlotte market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                Start Your Website
              </Button>
            </Link>
            <Link href="/get-quote">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Mail className="mr-2 w-5 h-5" />
                Get a Free Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const charlotteFeatures = [
  {
    icon: MapPin,
    title: 'Local Charlotte Expertise',
    description: 'We understand the Charlotte market and what local customers expect.',
  },
  {
    icon: Phone,
    title: 'Fast Response Times',
    description: 'Same-day responses for Charlotte clients. We are here when you need us.',
  },
  {
    icon: Check,
    title: 'Mobile-First Design',
    description: 'Perfect experience on smartphones - how most Charlotte residents browse.',
  },
  {
    icon: Mail,
    title: 'SEO for Charlotte',
    description: 'Optimized to rank for "near me" searches and Charlotte-specific keywords.',
  },
  {
    icon: ArrowRight,
    title: 'E-Commerce Ready',
    description: 'Online stores integrated with local delivery and pickup options.',
  },
  {
    icon: Phone,
    title: 'Ongoing Support',
    description: 'Monthly updates and maintenance included - no surprise fees.',
  },
];

const charlotteIndustries = [
  {
    name: 'Restaurants & Cafes',
    examples: 'Online menus, ordering, reservations',
  },
  {
    name: 'Real Estate',
    examples: 'IDX integration, property listings',
  },
  {
    name: 'Contractors',
    examples: 'Portfolios, quote forms, scheduling',
  },
  {
    name: 'Professional Services',
    examples: 'Lawyers, accountants, consultants',
  },
  {
    name: 'Healthcare',
    examples: 'Dentists, doctors, medical practices',
  },
  {
    name: 'Home Services',
    examples: 'Plumbers, HVAC, landscaping',
  },
  {
    name: 'Retail & E-Commerce',
    examples: 'Online stores, local delivery',
  },
  {
    name: 'Automotive',
    examples: 'Dealerships, repair shops, detailing',
  },
];
