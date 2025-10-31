
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Phone, 
  TrendingDown, 
  DollarSign, 
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Zap
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdLandingPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    businessType: "",
    biggestChallenge: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.businessName,
          phone: formData.phone,
          businessType: formData.businessType,
          message: `Pain Point: ${formData.biggestChallenge}`,
          source: "landing_page",
        }),
      });

      if (response.ok) {
        toast.success("Thanks! We'll call you in the next 5 minutes!");
        // Redirect to thank you page
        window.location.href = "/thank-you";
      } else {
        toast.error("Something went wrong. Please call us directly.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="relative w-10 h-10">
              <Image
                src="/logo-transparent.png"
                alt="Kreative Intelligence"
                fill
                className="object-contain
                  drop-shadow-[0_0_8px_rgba(147,51,234,0.6)] 
                  drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]
                  group-hover:drop-shadow-[0_0_12px_rgba(147,51,234,0.8)] 
                  group-hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.6)]
                  transition-all duration-300"
              />
            </div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Kreative Intelligence
              </div>
              <div className="text-[8px] text-gray-500 -mt-0.5">AI-Powered Solutions</div>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-black">
          <div className="relative w-full h-full">
            <Image
              src="https://thumbs.dreamstime.com/b/modern-workspace-computer-screen-displaying-code-vibrant-lighting-showing-stylish-colorful-ambiance-lit-warm-red-368956212.jpg"
              alt="Modern tech workspace"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6">
              <span className="bg-red-500/20 border border-red-500/50 rounded-full px-6 py-3 text-base font-semibold text-red-300">
                🔥 Local NC Businesses: Stop Losing Customers to Google
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Is Your Business <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Invisible on Google?</span>
            </h1>
            
            <p className="text-3xl md:text-4xl text-gray-100 mb-4 max-w-4xl mx-auto font-bold">
              You're Losing Customers Every Single Day.
            </p>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Your competitors show up. <span className="text-white font-bold">You don't.</span> That ends today.
            </p>

            <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 border-2 border-green-500 rounded-2xl p-8 max-w-2xl mx-auto mb-10">
              <p className="text-2xl md:text-3xl text-white font-bold mb-3">
                Get a Professional Website for $997
              </p>
              <p className="text-lg text-gray-300">
                (Not $5,000) • SEO-Optimized • Captures Leads 24/7 • Built in 7-14 Days
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-xl px-12 py-8 group shadow-2xl shadow-green-500/50">
                <a href="#get-quote" className="flex items-center">
                  Get Found on Google - $997
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 border-2 border-white text-xl px-12 py-8 font-bold shadow-xl shadow-white/20">
                <Link href="/portfolio">See Our Work</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-semibold text-green-400">LIVE</span>
                <span>✓ Currently serving 13+ active clients</span>
              </div>
              <span>•</span>
              <span>✓ Built in 7-14 Days</span>
              <span>•</span>
              <span>✓ Rush Options Available</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Amplification Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Here's What's Happening <span className="text-red-400">While You Read This:</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Every minute you're invisible on Google, money walks out the door.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-red-900/40 to-red-900/20 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30"
            >
              <div className="bg-red-600/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-white font-bold mb-3 text-2xl">📉 Your Competitor Just Got Another Call</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                While you're invisible on Google, they're getting found. They're not better than you—they just <span className="text-white font-semibold">LOOK</span> better online.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-orange-900/40 to-orange-900/20 backdrop-blur-lg rounded-2xl p-8 border border-orange-500/30"
            >
              <div className="bg-orange-600/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-white font-bold mb-3 text-2xl">💸 You Just Lost $200</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Another customer searched for a business like yours, didn't find you, and went to your competitor. That's $20K-$100K in <span className="text-white font-semibold">lost annual revenue.</span>
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-900/40 to-yellow-900/20 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30"
            >
              <div className="bg-yellow-600/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-white font-bold mb-3 text-2xl">⏰ Another Day Goes By</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                How many more weeks will you wait while money walks out the door? Every day you delay, your competitors get <span className="text-white font-semibold">stronger.</span>
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 py-8">
              <a href="#get-quote" className="flex items-center">
                I'm Ready to Fix This Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Stack Section */}
      <section id="get-quote" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Here's What You Get for <span className="text-green-400">$997</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Everything you need to start showing up on Google and capturing leads 24/7
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Value Stack */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">📦 Complete Website Package:</h3>
              
              <div className="space-y-4 mb-8">
                {[
                  { item: "Custom Professional Website", value: "$5,000", description: "No templates, built for YOUR business" },
                  { item: "AI-Powered Lead Capture Chatbot", value: "$300", description: "Works 24/7, never sleeps" },
                  { item: "Google Business Setup & SEO", value: "$500", description: "Get found on Google from day 1" },
                  { item: "Mobile-Responsive Design", value: "$400", description: "Perfect on phone, tablet, desktop" },
                  { item: "Contact Forms + Email Alerts", value: "$150", description: "Never miss a lead" },
                  { item: "Social Media Integration", value: "$150", description: "Connect all your profiles" },
                  { item: "SSL Security + Fast Hosting Setup", value: "$400", description: "Safe, fast, reliable infrastructure" },
                  { item: "30-Day Support & Revisions", value: "$200", description: "We've got your back" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white font-semibold">{item.item}</span>
                        <span className="text-gray-400 text-sm">Worth {item.value}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hosting Fee Information */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Monthly Hosting & Maintenance
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Setup Fee (one-time):</span>
                    <span className="text-white font-semibold">$9.97</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Monthly Hosting:</span>
                    <span className="text-white font-semibold">$47/month</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-3 pt-3 border-t border-blue-500/20">
                    Includes: Premium hosting, security updates, daily backups, 99.9% uptime, and ongoing technical support
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-600 pt-6">
                <div className="flex justify-between items-center text-2xl mb-2">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-gray-400 line-through">$7,100</span>
                </div>
                <div className="flex justify-between items-center text-4xl font-bold">
                  <span className="text-white">You Pay:</span>
                  <span className="text-green-400">$997</span>
                </div>
                <p className="text-center text-gray-400 text-sm mt-3">⚡ Flexible financing available - let's talk about your budget</p>
              </div>
            </div>

            {/* Right Column: Lead Form */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30 sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-2">Get Your Custom Quote in 60 Seconds</h3>
              <p className="text-gray-300 mb-6">No obligation. We'll call you to discuss your specific needs.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="businessName" className="text-white mb-2 block">Business Name *</Label>
                  <Input
                    id="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Your Business Name"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white mb-2 block">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="businessType" className="text-white mb-2 block">Business Type *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                    required
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant / Cafe</SelectItem>
                      <SelectItem value="contractor">Contractor / Home Services</SelectItem>
                      <SelectItem value="realestate">Real Estate</SelectItem>
                      <SelectItem value="salon">Salon / Spa</SelectItem>
                      <SelectItem value="medical">Medical / Dental</SelectItem>
                      <SelectItem value="retail">Retail Store</SelectItem>
                      <SelectItem value="professional">Professional Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="biggestChallenge" className="text-white mb-2 block">Biggest Challenge Right Now *</Label>
                  <Select
                    value={formData.biggestChallenge}
                    onValueChange={(value) => setFormData({ ...formData, biggestChallenge: value })}
                    required
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="What's your biggest pain point?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_showing_up">Not showing up on Google</SelectItem>
                      <SelectItem value="competitors_winning">Competitors are stealing customers</SelectItem>
                      <SelectItem value="cant_afford">Can't afford expensive designers</SelectItem>
                      <SelectItem value="missing_leads">Losing money from missed leads</SelectItem>
                      <SelectItem value="unprofessional">Looking unprofessional online</SelectItem>
                      <SelectItem value="no_time">No time to build it myself</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-xl py-7"
                >
                  {isSubmitting ? "Submitting..." : "Get My Custom Quote →"}
                </Button>

                <p className="text-gray-400 text-sm text-center">
                  🔒 We respect your privacy. No spam, ever.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            <span className="text-blue-400">See What We've Built</span> for Businesses Like Yours
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Real websites. Real results. This could be yours next.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Evangelical Fellowship Center",
                type: "Church Website",
                image: "/portfolio/evangelical-fellowship-center.png",
                description: "Beautifully crafted church website serving the Mount Olive, NC community with event management, service information, and community engagement features.",
                technologies: ["React", "Next.js", "Tailwind CSS", "CMS Integration"],
                features: ["Event Calendar", "Service Times", "Online Giving", "Community Portal"],
              },
              {
                name: "Kintek Solutions",
                type: "Tech Services",
                image: "/portfolio/kintek-solutions.jpg",
                description: "Fast, reliable computer repair service in Raleigh, NC. Fully optimized website with online booking, service tracking, and customer reviews. 15+ years, 5,000+ repairs.",
                technologies: ["Next.js", "Booking System", "Review Integration", "Local SEO"],
                features: ["Online Booking", "Service Tracking", "Client Reviews", "Live Chat"],
              },
              {
                name: "Esmeralda's Cafe",
                type: "Restaurant",
                image: "/portfolio/esmeraldas-cafe.jpg",
                description: "Vibrant coffee shop website in Durham, NC featuring online menu, gallery, location info, and community engagement. Perfect blend of aesthetics and functionality.",
                technologies: ["WordPress", "Menu Management", "Photo Gallery", "Google Maps"],
                features: ["Digital Menu", "Photo Gallery", "Contact Info", "Social Integration"],
              },
              {
                name: "PatternProof AI",
                type: "Web Application",
                image: "/portfolio/patternproof.png",
                description: "Revolutionary AI-powered platform for high-conflict co-parenting that detects narcissistic abuse patterns in communications with 94% accuracy.",
                technologies: ["Next.js", "OpenAI GPT-4", "Pattern Recognition", "Cloud Storage"],
                features: ["AI Pattern Detection", "Court Documentation", "Communication Analysis", "Evidence Export"],
              },
              {
                name: "InvoX AI CRM",
                type: "Web Application",
                image: "/portfolio/invoxai-crm.jpg",
                description: "World's first voice-activated CRM and invoicing system. Create invoices, manage clients, and track revenue—all hands-free. 10x faster than typing.",
                technologies: ["React", "Voice Recognition", "CRM Integration", "Invoice Generation"],
                features: ["Voice Commands", "Client Management", "Invoice Creation", "Revenue Tracking"],
              },
              {
                name: "Taltre Services",
                type: "Healthcare Services",
                image: "/portfolio/taltre-services.png",
                description: "Compassionate non-medical home assistance for seniors in Goldsboro, NC. User-friendly website designed for families seeking trusted senior care services.",
                technologies: ["React", "Healthcare Compliance", "HIPAA Ready", "CMS"],
                features: ["Service Information", "Care Plans", "Contact System", "Resource Library"],
              },
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all"
              >
                <div className="relative aspect-video bg-gray-800">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                      {project.type}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-gray-800/70 rounded text-xs text-gray-300 border border-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">Key Features</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-xs text-gray-400">
                          <CheckCircle2 className="w-3 h-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10 text-lg px-8" asChild>
              <Link href="/portfolio">View Full Portfolio →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Why This Is Different Than <span className="text-purple-400">Everything Else</span> You've Tried:
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Not another template site. Not another "we'll get back to you in 3 weeks."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                bad: "Fiverr garbage",
                good: "Custom design that looks like $5K",
                icon: <XCircle className="w-6 h-6" />,
                checkIcon: <CheckCircle2 className="w-6 h-6" />,
              },
              {
                bad: "Slow (months to launch)",
                good: "Done in 7-14 days",
                icon: <XCircle className="w-6 h-6" />,
                checkIcon: <CheckCircle2 className="w-6 h-6" />,
              },
              {
                bad: "DIY headaches",
                good: "We build everything for you",
                icon: <XCircle className="w-6 h-6" />,
                checkIcon: <CheckCircle2 className="w-6 h-6" />,
              },
              {
                bad: "$5K+ price tag",
                good: "Same quality for $997",
                icon: <XCircle className="w-6 h-6" />,
                checkIcon: <CheckCircle2 className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start gap-2 text-red-400 mb-4">
                  {item.icon}
                  <span className="font-semibold">NOT {item.bad}</span>
                </div>
                <div className="flex items-start gap-2 text-green-400">
                  {item.checkIcon}
                  <span className="font-semibold">{item.good}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with Guarantee */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-green-900/40 to-green-900/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-green-500/50">
            <Zap className="w-16 h-16 text-green-400 mx-auto mb-6" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Showing Up on Google in <span className="text-green-400">7-14 Days</span>
            </h2>
            
            <div className="space-y-3 mb-8 text-lg text-gray-300">
              <p>⏰ Every day you wait:</p>
              <p className="text-red-400 font-semibold">• Competitors get stronger</p>
              <p className="text-red-400 font-semibold">• You lose more money</p>
              <p className="text-red-400 font-semibold">• Getting caught up gets harder</p>
            </div>

            <div className="bg-blue-900/30 rounded-xl p-6 mb-8 border border-blue-500/30">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white mb-2">30-Day Money-Back Guarantee</p>
              <p className="text-gray-300">If you don't love it, full refund. No questions asked.</p>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-2xl px-16 py-10 mb-4 shadow-2xl shadow-green-500/50">
              <a href="#get-quote" className="flex items-center">
                Claim Your $997 Website Now
                <ArrowRight className="ml-3 w-7 h-7" />
              </a>
            </Button>

            <p className="text-gray-400 text-sm">⚡ Flexible financing available - speak with us about your budget</p>
            
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 mb-4">Prefer to talk? We're here 24/7:</p>
              <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-500 shadow-xl shadow-blue-500/30 text-lg px-8">
                <a href="tel:+19844009443" className="flex items-center">
                  <Phone className="mr-2 w-5 h-5" />
                  Call or Text: (984) 400-9443
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
