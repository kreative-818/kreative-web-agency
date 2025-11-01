
"use client";

import { useState } from "react";
import { Check, Zap, Sparkles, Crown, Phone, Globe, Code, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Website Development Packages
const websitePackages = [
  {
    name: "Basic",
    icon: Zap,
    price: 997,
    monthlyRetainer: 47,
    description: "Perfect for small businesses getting started online",
    marketValue: "Competitors charge $2,000-$3,000",
    features: [
      "Professional 5-7 page website",
      "Mobile-responsive design",
      "AI chatbot integration",
      "Contact form & lead capture",
      "Basic SEO optimization",
      "Hosting & SSL included",
      "30 days support",
      "Email support (24hr response)"
    ],
    retainerFeatures: [
      "Hosting & security updates",
      "Monthly backups",
      "Email support (24hr response)",
      "Minor content updates"
    ],
    highlight: false,
    productId: "website_basic"
  },
  {
    name: "Professional",
    icon: Sparkles,
    price: 1997,
    monthlyRetainer: 97,
    description: "For growing businesses ready to dominate their market",
    marketValue: "Competitors charge $4,000-$6,000",
    features: [
      "Everything in Basic, plus:",
      "10-15 custom pages",
      "Advanced AI chatbot + Sona AI phone system",
      "Google My Business optimization",
      "Social media integration",
      "Blog setup with 3 SEO articles",
      "E-commerce ready (up to 50 products)",
      "90 days priority support",
      "Weekly performance reports"
    ],
    retainerFeatures: [
      "Everything in Basic +",
      "Priority support (4hr response)",
      "1 hour of updates/month",
      "Monthly performance reports",
      "Content updates"
    ],
    highlight: true,
    badge: "Most Popular",
    productId: "website_professional"
  },
  {
    name: "Premium",
    icon: Crown,
    price: 3997,
    monthlyRetainer: 197,
    description: "Complete digital domination for serious business growth",
    marketValue: "Competitors charge $8,000-$12,000",
    features: [
      "Everything in Professional, plus:",
      "Unlimited pages & custom features",
      "Full e-commerce platform (unlimited products)",
      "Multi-channel automation (SMS, email, chat)",
      "Advanced lead gen & CRM integration",
      "Monthly SEO blog content (4 articles)",
      "Social media content automation",
      "6 months premium support",
      "Bi-weekly strategy calls",
      "Custom integrations (Stripe, Zapier, etc.)"
    ],
    retainerFeatures: [
      "Everything in Professional +",
      "Unlimited minor updates",
      "Monthly SEO content (1 article)",
      "Social media integration",
      "Bi-weekly strategy calls"
    ],
    highlight: false,
    productId: "website_premium"
  }
];

// Web Application Packages
const webAppPackages = [
  {
    name: "Basic",
    icon: Zap,
    price: 4997,
    monthlyRetainer: 297,
    description: "Custom web application for startups and small businesses",
    marketValue: "Competitors charge $8,000-$12,000",
    features: [
      "Custom web application (up to 10 pages/views)",
      "User authentication & roles",
      "Database integration",
      "Basic API integrations (2-3)",
      "Mobile-responsive design",
      "Admin dashboard",
      "30 days support",
      "Documentation included"
    ],
    retainerFeatures: [
      "Hosting & infrastructure monitoring",
      "Bug fixes & security patches",
      "Database backups",
      "Email support"
    ],
    highlight: false,
    productId: "webapp_basic"
  },
  {
    name: "Professional",
    icon: Sparkles,
    price: 9997,
    monthlyRetainer: 497,
    description: "Advanced web application with custom features",
    marketValue: "Competitors charge $18,000-$30,000",
    features: [
      "Everything in Basic, plus:",
      "Advanced web application (up to 25 pages/views)",
      "Custom admin dashboard",
      "Multiple user roles & permissions",
      "Payment gateway integration",
      "Advanced API integrations (5-7)",
      "Real-time features",
      "90 days priority support",
      "Training & documentation"
    ],
    retainerFeatures: [
      "Everything in Basic +",
      "Feature updates (2hrs/month)",
      "Priority support (2hr response)",
      "Monthly reporting",
      "Performance optimization"
    ],
    highlight: true,
    badge: "Best Value",
    productId: "webapp_professional"
  },
  {
    name: "Premium",
    icon: Crown,
    price: 19997,
    monthlyRetainer: 997,
    description: "Enterprise-grade web application with AI capabilities",
    marketValue: "Competitors charge $35,000-$60,000",
    features: [
      "Everything in Professional, plus:",
      "Complex enterprise web application",
      "Unlimited pages/views",
      "AI-powered features",
      "Advanced workflows & automation",
      "Custom integrations (unlimited)",
      "Scalable cloud architecture",
      "6 months premium support",
      "Dedicated account manager"
    ],
    retainerFeatures: [
      "Everything in Professional +",
      "Continuous development (8hrs/month)",
      "Dedicated account manager",
      "24/7 monitoring",
      "Scaling & optimization"
    ],
    highlight: false,
    productId: "webapp_premium"
  }
];

// Automation Services Packages
const automationPackages = [
  {
    name: "Basic",
    icon: Zap,
    price: 997,
    monthlyRetainer: 97,
    description: "Essential automation to streamline your business",
    marketValue: "Competitors charge $1,500-$2,500",
    features: [
      "Initial automation assessment",
      "3 automated workflows",
      "Email/SMS automation",
      "Basic CRM setup",
      "Integration with existing tools",
      "30 days support & monitoring",
      "Documentation & training",
      "Email support"
    ],
    retainerFeatures: [
      "Monitoring & basic optimization",
      "Monthly performance review",
      "Email support"
    ],
    highlight: false,
    productId: "automation_basic"
  },
  {
    name: "Professional",
    icon: Sparkles,
    price: 2997,
    monthlyRetainer: 197,
    description: "Comprehensive automation suite for growing businesses",
    marketValue: "Competitors charge $5,000-$8,000",
    features: [
      "Everything in Basic, plus:",
      "10 automated workflows",
      "Full CRM integration & customization",
      "Lead scoring & routing",
      "Social media automation",
      "Marketing automation setup",
      "90 days priority support",
      "Monthly optimization review",
      "Priority phone support"
    ],
    retainerFeatures: [
      "Everything in Basic +",
      "Workflow optimization",
      "Monthly reporting",
      "Integration updates",
      "Priority support"
    ],
    highlight: true,
    badge: "Most Popular",
    productId: "automation_professional"
  },
  {
    name: "Premium",
    icon: Crown,
    price: 7997,
    monthlyRetainer: 397,
    description: "Complete automation transformation with AI",
    marketValue: "Competitors charge $12,000-$25,000",
    features: [
      "Everything in Professional, plus:",
      "Unlimited automated workflows",
      "AI-powered automation",
      "Advanced lead generation",
      "Multi-channel automation",
      "Custom integrations",
      "Real-time analytics dashboard",
      "6 months premium support",
      "Bi-weekly strategy calls"
    ],
    retainerFeatures: [
      "Everything in Professional +",
      "Continuous improvement",
      "Bi-weekly strategy calls",
      "New automation additions",
      "Advanced analytics"
    ],
    highlight: false,
    productId: "automation_premium"
  }
];

// Helper function to render pricing cards
function PricingCards({ packages, billingPeriod }: { packages: typeof websitePackages; billingPeriod: 'monthly' | 'yearly' }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-2">
      {packages.map((pkg) => {
        const Icon = pkg.icon;
        const monthlyPrice = pkg.monthlyRetainer;
        const yearlyPrice = monthlyPrice ? Math.round(monthlyPrice * 12 * 0.85) : 0; // 15% discount for yearly
        const yearlySavings = monthlyPrice ? (monthlyPrice * 12) - yearlyPrice : 0;
        
        const displayPrice = billingPeriod === 'yearly' && yearlyPrice > 0 ? yearlyPrice : monthlyPrice;
        const priceLabel = billingPeriod === 'yearly' ? '/year' : '/month';
        
        return (
          <Card 
            key={pkg.name}
            className={`relative bg-white ${
              pkg.highlight 
                ? "border-2 border-blue-500 shadow-2xl shadow-blue-100 md:scale-105" 
                : "border-slate-200"
            }`}
          >
            {pkg.badge && (
              <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-blue-600 text-white px-3 md:px-4 py-1 text-xs md:text-sm font-bold border border-blue-500">
                  {pkg.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Icon className={`w-12 h-12 ${pkg.highlight ? "text-blue-600" : "text-slate-400"}`} />
              </div>
              <CardTitle className="text-2xl text-center text-slate-900">{pkg.name}</CardTitle>
              <CardDescription className="text-slate-600 text-center min-h-[48px]">
                {pkg.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-6 text-center border-b border-slate-200 pb-6">
                <div className="flex items-baseline justify-center mb-1">
                  <span className="text-5xl md:text-6xl font-bold text-slate-900">${pkg.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-500 mb-3">
                  One-time investment
                </p>
                
                {pkg.monthlyRetainer && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-slate-600 mb-1">Support & Maintenance</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <p className="text-2xl font-bold text-green-700">${displayPrice}</p>
                      <p className="text-sm text-slate-600">{priceLabel}</p>
                    </div>
                    {billingPeriod === 'yearly' && yearlySavings > 0 && (
                      <p className="text-xs text-green-700 mt-1 font-semibold">
                        Save ${yearlySavings}/year
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">Cancel anytime</p>
                  </div>
                )}
                
                <p className="text-xs text-slate-500 mt-3">
                  {pkg.marketValue}
                </p>
              </div>

              <div className="space-y-2 md:space-y-3 mb-4">
                <p className="text-sm font-semibold text-slate-900 mb-2">Initial Development Includes:</p>
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 md:gap-3">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className={`text-sm md:text-base ${feature.includes("Everything in") ? "font-semibold text-blue-600" : "text-slate-700"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {pkg.retainerFeatures && pkg.retainerFeatures.length > 0 && (
                <div className="space-y-2 md:space-y-3 pt-4 border-t border-slate-200">
                  <p className="text-sm font-semibold text-green-700 mb-2">Monthly Retainer Includes:</p>
                  {pkg.retainerFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 md:gap-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Link href={`/get-started?package=${pkg.productId}&price=${pkg.price}&billing=${billingPeriod}&retainer=${displayPrice || 0}`} className="w-full">
                <Button 
                  className={`w-full ${pkg.highlight ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" : "bg-slate-700 hover:bg-slate-800 text-white"}`}
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<string>("websites");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <Badge variant="outline" className="mb-4 border-blue-500 text-blue-600 bg-blue-50">
            Transparent Pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-slate-900">
            Premium Solutions, Accessible Prices
          </h1>
          <p className="text-xl text-slate-600 mb-4">
            No hidden fees. No surprise charges. Just honest, upfront pricing for professional services.
          </p>
          <p className="text-lg text-slate-500">
            Choose from websites, web applications, or automation services
          </p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label htmlFor="billing-toggle" className={`text-base ${billingPeriod === 'monthly' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingPeriod === 'yearly'}
            onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-300"
          />
          <Label htmlFor="billing-toggle" className={`text-base ${billingPeriod === 'yearly' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
            Yearly
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
              Save 15%
            </span>
          </Label>
        </div>

        {/* Tabbed Pricing Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12 bg-slate-100 p-1 border border-slate-200 shadow-sm">
            <TabsTrigger 
              value="websites"
              onClick={() => setActiveTab("websites")}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-slate-900 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-50 transition-all duration-300 cursor-pointer font-medium"
            >
              <Globe className="w-4 h-4 mr-2" />
              Websites
            </TabsTrigger>
            <TabsTrigger 
              value="web-apps"
              onClick={() => setActiveTab("web-apps")}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-slate-900 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-50 transition-all duration-300 cursor-pointer font-medium"
            >
              <Code className="w-4 h-4 mr-2" />
              Web Apps
            </TabsTrigger>
            <TabsTrigger 
              value="automation"
              onClick={() => setActiveTab("automation")}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-slate-900 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-50 transition-all duration-300 cursor-pointer font-medium"
            >
              <Settings className="w-4 h-4 mr-2" />
              Automation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="websites">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">Website Development</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Professional websites that drive results and convert visitors into customers
              </p>
            </div>
            <PricingCards packages={websitePackages} billingPeriod={billingPeriod} />
          </TabsContent>

          <TabsContent value="web-apps">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">Web Application Development</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Custom web applications built to scale your business and automate processes
              </p>
            </div>
            <PricingCards packages={webAppPackages} billingPeriod={billingPeriod} />
          </TabsContent>

          <TabsContent value="automation">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">Business Automation Services</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Streamline operations and save time with intelligent automation solutions
              </p>
            </div>
            <PricingCards packages={automationPackages} billingPeriod={billingPeriod} />
          </TabsContent>
        </Tabs>

        {/* Custom Solutions CTA */}
        <div className="mt-20 text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-3xl text-slate-900">Need a Custom Solution?</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                We can create a tailored package that perfectly fits your unique business needs
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                  Schedule a Consultation
                </Button>
              </Link>
              <Link href="tel:+17048068682">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  (704) 806-8682
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">Trusted by businesses across North Carolina</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              Fast Delivery (2-4 weeks)
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              No Hidden Fees
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              Transparent Process
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              100% Satisfaction Guarantee
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-8">
            Premium quality. No DIY headaches. Real results.
          </p>
        </div>
      </div>
    </div>
  );
}
