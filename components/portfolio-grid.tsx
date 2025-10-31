
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Globe, Sparkles } from "lucide-react";

const PortfolioGrid = () => {

  const projects = [
    // === WEBSITES ===
    {
      title: "Evangelical Fellowship Center",
      description: "Beautifully crafted church website serving the Mount Olive, NC community with event management, service information, and community engagement features.",
      image: "/portfolio/evangelical-fellowship-center.png",
      category: "Church Website",
      url: "https://efcmtolive.com/",
      technologies: ["React", "Next.js", "Tailwind CSS", "CMS Integration"],
      features: ["Event Calendar", "Service Times", "Online Giving", "Community Portal"],
    },
    {
      title: "Dwell Temple Training Center",
      description: "Modern faith-based training platform designed for ministry development with live streaming capabilities, event management, and member engagement tools.",
      image: "/portfolio/dwell-temple-training.png",
      category: "Religious Platform",
      url: "https://temple-pulse-live.lovable.app/",
      technologies: ["React", "Live Streaming API", "Payment Gateway", "Cloud Hosting"],
      features: ["Live Streaming", "Course Management", "Member Portal", "Donation System"],
    },
    {
      title: "Prominent Cleaning Solutions",
      description: "Professional commercial cleaning service website for Goldsboro, NC featuring online quote requests, service showcase, and client testimonials.",
      image: "/portfolio/prominent-cleaning.jpg",
      category: "Service Business",
      url: "https://prominentcleaningsolutions.kreativeintelligencellc.multisiteadmin.com/",
      technologies: ["WordPress", "Custom Theme", "SEO Optimization", "Contact Forms"],
      features: ["Quote System", "Service Areas", "Testimonials", "Mobile Responsive"],
    },
    {
      title: "Kintek Solutions",
      description: "Fast, reliable computer repair service in Raleigh, NC. Fully optimized website with online booking, service tracking, and customer reviews. 15+ years, 5,000+ repairs.",
      image: "/portfolio/kintek-solutions.jpg",
      category: "Tech Services",
      url: "https://kinteksolutions.kreativeintelligencellc.multisiteadmin.com/",
      technologies: ["Next.js", "Booking System", "Review Integration", "Local SEO"],
      features: ["Online Booking", "Service Tracking", "Client Reviews", "Live Chat"],
    },
    {
      title: "Taltre Services",
      description: "Compassionate non-medical home assistance for seniors in Goldsboro, NC. User-friendly website designed for families seeking trusted senior care services.",
      image: "/portfolio/taltre-services.png",
      category: "Healthcare Services",
      url: "https://taltreservices.com/",
      technologies: ["React", "Healthcare Compliance", "HIPAA Ready", "CMS"],
      features: ["Service Information", "Care Plans", "Contact System", "Resource Library"],
    },
    {
      title: "Esmeralda's Cafe",
      description: "Vibrant coffee shop website in Durham, NC featuring online menu, gallery, location info, and community engagement. Perfect blend of aesthetics and functionality.",
      image: "/portfolio/esmeraldas-cafe.jpg",
      category: "Restaurant Website",
      url: "https://esmeraldascoffee.com/",
      technologies: ["WordPress", "Menu Management", "Photo Gallery", "Google Maps"],
      features: ["Digital Menu", "Photo Gallery", "Contact Info", "Social Media Integration"],
    },
    // === WEB APPLICATIONS (In Development) ===
    {
      title: "PatternProof AI",
      description: "Revolutionary AI-powered platform for high-conflict co-parenting that detects narcissistic abuse patterns in communications with 94% accuracy. Helps parents build court cases with evidence-based insights—16x cheaper than therapy.",
      image: "/portfolio/patternproof.png",
      category: "Web Application",
      url: "https://www.patternproofai.com/",
      technologies: ["Next.js", "OpenAI GPT-4", "Pattern Recognition", "Cloud Storage"],
      features: ["AI Pattern Detection", "Court Documentation", "Communication Analysis", "Evidence Export"],
      inDevelopment: true,
    },
    {
      title: "ReturnReady AI",
      description: "Intelligent tax document organization system that automatically digitizes, organizes, and categorizes financial documents. Eliminates the yearly tax scramble with smart automation and searchable tax-ready packets.",
      image: "/portfolio/returnready.png",
      category: "Web Application",
      url: "https://return-ready-ai.lovable.app/",
      technologies: ["React", "OCR Technology", "AI Classification", "Cloud Storage"],
      features: ["Auto-Categorization", "Document Scanning", "Searchable Archives", "Tax Packet Generation"],
      inDevelopment: true,
    },
    {
      title: "Memory Lock Safe",
      description: "Secure password management platform designed specifically for seniors, providing simple password storage with family peace of mind. Enables loved ones to have safe emergency access to critical accounts.",
      image: "/portfolio/memory-lock-safe.jpg",
      category: "Web Application",
      url: "https://memory-lock-safe.lovable.app/",
      technologies: ["Next.js", "Encryption", "Emergency Access", "Multi-Factor Auth"],
      features: ["Secure Vault", "Emergency Contacts", "Simple Interface", "Account Recovery"],
      inDevelopment: true,
    },
    {
      title: "AutoPulse",
      description: "AI-powered content generation platform that transforms websites into social media gold. Automatically scans any website, identifies target audiences, and generates high-converting social media content that drives engagement and sales.",
      image: "/portfolio/autopulse.png",
      category: "Web Application",
      url: "https://autopulse.abacusai.app/",
      technologies: ["Next.js", "GPT-4", "Web Scraping", "Social Media APIs"],
      features: ["Website Analysis", "Content Generation", "Audience Targeting", "Multi-Platform Publishing"],
      inDevelopment: true,
    },
    {
      title: "InvoxAI (VoiceInvoice CRM)",
      description: "World's first voice-activated CRM and invoicing system. Create invoices, manage clients, and track revenue—all hands-free. 10x faster than typing with 99% accuracy, available 24/7 for busy entrepreneurs on the go.",
      image: "/portfolio/invoxai-crm.jpg",
      category: "Web Application",
      url: "https://voiceinvoice-crm-2bb397.abacusai.app/",
      technologies: ["React", "Voice Recognition", "CRM Integration", "Invoice Generation"],
      features: ["Voice Commands", "Client Management", "Invoice Creation", "Revenue Tracking"],
      inDevelopment: true,
    },
    {
      title: "Or Torah",
      description: "Innovative AI-powered spiritual guidance platform bringing ancient wisdom to modern life. Users type what they're feeling and receive personalized sacred scripture that speaks directly to their heart—a digital companion for faith journeys.",
      image: "/portfolio/or-torah.jpg",
      category: "Web Application",
      url: "https://or-torah-web-426yg0.abacusai.app/",
      technologies: ["Next.js", "Natural Language Processing", "Scripture Database", "Hebrew Calendar"],
      features: ["Scripture Search", "Emotional Context", "Daily Wisdom", "Hebrew Calendar Integration"],
      inDevelopment: true,
    },
    {
      title: "Kreative Intelligence (This Site)",
      description: "Premium AI-powered agency platform featuring automated lead generation, intelligent client management, and advanced project tracking. Built with cutting-edge technology to showcase our expertise in delivering enterprise-grade solutions.",
      image: "/portfolio/kreative-intelligence.png",
      category: "Web Application",
      url: "https://kreativeaiagency.com/",
      technologies: ["Next.js", "PostgreSQL", "Google Places API", "OpenPhone Integration"],
      features: ["Lead Scraping", "AI Scoring", "Automated Outreach", "Analytics Dashboard"],
      inDevelopment: false,
    },
    {
      title: "Kreative Image AI",
      description: "Transform your ideas into stunning AI-generated images with our powerful creation platform. From free to unlimited plans, create beautiful images and bring your imagination to life with cutting-edge AI technology. Join thousands of creators already using the platform.",
      image: "/portfolio/kreative-image-ai.png",
      category: "Web Application",
      url: "https://kreativeimageai.com/",
      technologies: ["Next.js", "Replicate AI", "Image Generation APIs", "Cloud Storage"],
      features: ["AI Image Generation", "Multiple Pricing Plans", "HD Quality Output", "Unlimited Creation"],
      inDevelopment: true,
    },
    {
      title: "ChordSync",
      description: "Revolutionary music collaboration platform that empowers musicians to discover, connect, and create together. Real-time project sharing, skill-based matching, and seamless communication tools designed for the modern music creator.",
      image: "/portfolio/chordsync.png",
      category: "Web Application",
      url: "https://chordsync.abacusai.app/",
      technologies: ["Next.js", "Real-time Collaboration", "WebSocket", "Audio Processing"],
      features: ["Musician Matching", "Project Collaboration", "File Sharing", "Direct Messaging"],
      inDevelopment: true,
    },
    {
      title: "Southern Ready Mix NC",
      description: "Professional concrete supply and delivery platform serving North Carolina. Features online quote requests, project management tools, and real-time delivery tracking for contractors and builders.",
      image: "/portfolio/southern-ready-mix-nc.png",
      category: "Service Business",
      url: "https://southernreadymixnc.abacusai.app/",
      technologies: ["Next.js", "Quote System", "Delivery Tracking", "Payment Gateway"],
      features: ["Online Quotes", "Delivery Scheduling", "Project Management", "Customer Portal"],
      inDevelopment: true,
    },
    {
      title: "Church Alive",
      description: "Modern church management platform connecting congregations digitally. Stream sermons, manage events, process donations, and engage with members—all in one beautiful, easy-to-use application.",
      image: "/portfolio/church-alive.png",
      category: "Web Application",
      url: "https://churchaliveapp.abacusai.app/dashboard",
      technologies: ["React", "Live Streaming", "Event Management", "Payment Processing"],
      features: ["Sermon Streaming", "Event Calendar", "Donation Portal", "Member Directory"],
      inDevelopment: true,
    },
  ];

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 text-sm font-semibold">Real Projects • Real Results</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Portfolio</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-3">
            From functional business websites to cutting-edge AI-powered applications
          </p>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            ✨ <span className="text-purple-600 font-semibold">Purple badges</span> indicate web apps currently in active development
          </p>
        </div>

        <div className="grid gap-12">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Project Image */}
              <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                <div className="relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden group border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* In Development Badge */}
                  {project.inDevelopment && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-semibold">In Development</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-white/90 backdrop-blur-lg hover:bg-white text-slate-900 shadow-lg"
                        asChild
                      >
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Live Site
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 rounded-full text-sm font-semibold text-white mr-4">
                      {project.category}
                    </span>
                    <Globe className="w-5 h-5 text-slate-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{project.title}</h3>
                  <p className="text-slate-600 mb-6">{project.description}</p>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700 border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-slate-600">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/get-started">Start Your Project</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGrid;
