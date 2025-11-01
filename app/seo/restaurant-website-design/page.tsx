export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'

import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Utensils, Phone, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Restaurant Website Design | Custom Websites for Restaurants & Cafes',
  description: 'Professional restaurant website design starting at $79/month. Get online ordering, menu management, reservations, and mobile-responsive design. Perfect for restaurants, cafes, and food businesses.',
  keywords: 'restaurant website design, restaurant web design, cafe website, online ordering website, restaurant website builder, menu website design',
};

export default function RestaurantWebsiteDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
            <Utensils className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Restaurant Website Specialists</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Restaurant Website Design
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              That Drives Orders
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Get a professional, mobile-friendly restaurant website with online ordering, menu management, and reservation system. 
            <strong className="text-white"> Starting at just $79/month</strong> with no upfront costs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/get-started">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8">
                Start Your Website <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                View Restaurant Examples
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>14-Day Free Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Everything Your Restaurant Needs Online
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-black/40 border border-gray-800 rounded-lg p-6 hover:border-orange-500/50 transition-all">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Simple, Affordable Pricing
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$79</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {starterFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/get-started">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-2 border-orange-500 rounded-xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Professional</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$149</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {professionalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/get-started">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-900/20 to-red-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Grow Your Restaurant Online?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of restaurants using our platform to attract more customers and increase orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                <Phone className="mr-2 w-5 h-5" />
                Get Started Now
              </Button>
            </Link>
            <Link href="/get-quote">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Mail className="mr-2 w-5 h-5" />
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Utensils,
    title: 'Online Ordering',
    description: 'Accept orders directly from your website with integrated payment processing.',
  },
  {
    icon: Phone,
    title: 'Menu Management',
    description: 'Easy-to-update digital menu with photos, prices, and descriptions.',
  },
  {
    icon: Mail,
    title: 'Reservation System',
    description: 'Let customers book tables online with automated confirmation emails.',
  },
  {
    icon: Check,
    title: 'Mobile Responsive',
    description: 'Perfect viewing experience on smartphones and tablets.',
  },
  {
    icon: ArrowRight,
    title: 'Photo Gallery',
    description: 'Showcase your dishes and ambiance with beautiful image galleries.',
  },
  {
    icon: Phone,
    title: 'Google Maps Integration',
    description: 'Help customers find you with integrated maps and directions.',
  },
];

const starterFeatures = [
  '5-page custom website',
  'Mobile-responsive design',
  'Digital menu display',
  'Contact form',
  'Google Maps integration',
  'Social media links',
  'Basic SEO optimization',
  'Free SSL certificate',
  'Monthly updates included',
];

const professionalFeatures = [
  'Everything in Starter, plus:',
  'Online ordering system',
  'Reservation booking',
  'Photo gallery',
  'Customer reviews display',
  'Newsletter signup',
  'Advanced SEO optimization',
  'Google My Business setup',
  'Social media integration',
  'Priority support',
];
