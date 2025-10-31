
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle, 
  Sparkles,
  Zap,
  Shield,
  Clock,
  Rocket,
  ArrowRight,
  Gift
} from "lucide-react";
import { toast } from "sonner";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  businessType: string;
  projectType: string;
  budget: string;
  timeline: string;
  projectDetails: string;
  servicesNeeded: string[];
};

const INITIAL_FORM_DATA: FormData = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  website: "",
  businessType: "",
  projectType: "",
  budget: "",
  timeline: "",
  projectDetails: "",
  servicesNeeded: []
};

const SERVICE_OPTIONS = [
  { id: "new-website", name: "New Website Build", icon: "🌐" },
  { id: "redesign", name: "Website Redesign", icon: "✨" },
  { id: "seo", name: "SEO Services", icon: "📈" },
  { id: "ai-automation", name: "AI Chatbot & Automation", icon: "🤖" },
  { id: "content", name: "Content Writing", icon: "✍️" },
  { id: "branding", name: "Branding & Logo Design", icon: "🎨" },
  { id: "marketing", name: "Digital Marketing", icon: "📱" },
  { id: "ecommerce", name: "E-Commerce Setup", icon: "🛒" }
];

const BONUS_FEATURES = [
  "AI-Powered Lead Capture Chatbot",
  "Mobile-Responsive Design",
  "Google Analytics Integration",
  "SEO Foundation Setup",
  "Social Media Integration",
  "Fast Loading Optimization",
  "SSL Security Certificate",
  "Click-to-Call & Map Integration",
  "Contact Forms with Email Notifications",
  "30-Day Support & Revisions"
];

export default function GetQuotePage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      servicesNeeded: prev.servicesNeeded.includes(serviceId)
        ? prev.servicesNeeded.filter(id => id !== serviceId)
        : [...prev.servicesNeeded, serviceId]
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required contact information");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.businessType) {
      toast.error("Please select your business type");
      return false;
    }
    if (!formData.projectType) {
      toast.error("Please tell us what type of project you need");
      return false;
    }
    if (!formData.budget) {
      toast.error("Please select your budget range");
      return false;
    }
    if (formData.servicesNeeded.length === 0) {
      toast.error("Please select at least one service you're interested in");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/intent-leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "Quote Request Form",
          status: "new"
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Quote request received! We'll contact you within 15 minutes.");
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 1500);
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit. Please try again or call us at (984) 400-9443.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 px-2">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/50 rounded-full px-6 py-2 text-sm font-semibold text-blue-300 mb-6">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Free Quote Request
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Get Your
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Free Custom Quote
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Tell us about your project and we'll create a custom quote tailored to your needs and budget. 
            <span className="block mt-2 text-blue-400 font-semibold">We'll respond within 15 minutes!</span>
          </p>
        </div>

        {/* Main Form */}
        <Card className="bg-gray-900/50 backdrop-blur-lg border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 mb-12">
          <CardContent className="p-6 md:p-10">
            <div className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                    <span className="text-white text-xl">1</span>
                  </div>
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-white text-base mb-2 block">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Smith"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white text-base mb-2 block">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white text-base mb-2 block">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessName" className="text-white text-base mb-2 block">Business Name</Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Your Business LLC"
                      value={formData.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-2 rounded-lg">
                    <span className="text-white text-xl">2</span>
                  </div>
                  Business Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white text-base mb-2 block">Business Type *</Label>
                    <Select value={formData.businessType} onValueChange={(value) => updateField("businessType", value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant / Cafe</SelectItem>
                        <SelectItem value="contractor">Contractor / Construction</SelectItem>
                        <SelectItem value="retail">Retail / Shop</SelectItem>
                        <SelectItem value="service">Service Business</SelectItem>
                        <SelectItem value="healthcare">Healthcare / Medical</SelectItem>
                        <SelectItem value="realestate">Real Estate</SelectItem>
                        <SelectItem value="salon">Salon / Spa</SelectItem>
                        <SelectItem value="professional">Professional Services</SelectItem>
                        <SelectItem value="tech">Technology / Software</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-white text-base mb-2 block">Current Website (if any)</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-teal-600 to-green-600 p-2 rounded-lg">
                    <span className="text-white text-xl">3</span>
                  </div>
                  Project Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <Label className="text-white text-base mb-2 block">What do you need? *</Label>
                    <Select value={formData.projectType} onValueChange={(value) => updateField("projectType", value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-website">New Website</SelectItem>
                        <SelectItem value="redesign">Website Redesign</SelectItem>
                        <SelectItem value="landing-page">Landing Page</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce Store</SelectItem>
                        <SelectItem value="seo">SEO Services</SelectItem>
                        <SelectItem value="marketing">Marketing Services</SelectItem>
                        <SelectItem value="ai-automation">AI Automation</SelectItem>
                        <SelectItem value="package">Complete Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-base mb-2 block">What's your budget? *</Label>
                    <Select value={formData.budget} onValueChange={(value) => updateField("budget", value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1k">Under $1,000</SelectItem>
                        <SelectItem value="1k-2.5k">$1,000 - $2,500</SelectItem>
                        <SelectItem value="2.5k-5k">$2,500 - $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-plus">$10,000+</SelectItem>
                        <SelectItem value="flexible">Flexible / Not Sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-base mb-2 block">When do you need it? *</Label>
                    <Select value={formData.timeline} onValueChange={(value) => updateField("timeline", value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12">
                        <SelectValue placeholder="Select your timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                        <SelectItem value="1-2-months">1-2 months</SelectItem>
                        <SelectItem value="3-plus-months">3+ months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Services Needed */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                    <span className="text-white text-xl">4</span>
                  </div>
                  What services are you interested in? *
                </h2>
                <p className="text-gray-400 mb-6">Select all that apply</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {SERVICE_OPTIONS.map((service) => (
                    <div
                      key={service.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.servicesNeeded.includes(service.id)
                          ? "bg-blue-600/20 border-blue-500"
                          : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => toggleService(service.id)}
                    >
                      <Checkbox
                        checked={formData.servicesNeeded.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <span className="text-2xl">{service.icon}</span>
                      <span className="text-white font-medium">{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-2 rounded-lg">
                    <span className="text-white text-xl">5</span>
                  </div>
                  Tell us more about your project
                </h2>
                <p className="text-gray-400 mb-4">Any specific features, goals, or requirements?</p>
                <Textarea
                  placeholder="Example: I need a professional website for my restaurant with online ordering, table reservations, and menu showcase. Should work great on mobile devices."
                  value={formData.projectDetails}
                  onChange={(e) => updateField("projectDetails", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white min-h-[150px]"
                />
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-700 pt-8">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-14 text-lg font-bold shadow-2xl shadow-blue-500/50"
                >
                  {submitting ? "Submitting..." : "Get My Free Quote"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-gray-400 mt-4">
                  <Clock className="w-4 h-4 inline mr-2" />
                  We'll respond within 15 minutes with your custom quote
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bonus Section - What's Included */}
        <div className="bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 border-2 border-green-500/30 rounded-2xl p-6 md:p-10 mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/50 rounded-full px-6 py-2 text-sm font-semibold text-green-300 mb-4">
              <Gift className="w-4 h-4" />
              BONUS: What's Included in Every Website
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Premium Features Included
            </h2>
            <p className="text-gray-300 text-lg">
              Every website we build comes with these professional features at no extra cost
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {BONUS_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-green-400 font-semibold text-lg">
              All of this comes standard with every project!
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Zap, title: "Fast Delivery", desc: "7-14 days" },
            { icon: Shield, title: "Money-Back Guarantee", desc: "30 days" },
            { icon: Clock, title: "Quick Response", desc: "Within 15 min" },
            { icon: Rocket, title: "13+ Active Clients", desc: "Proven results" }
          ].map((item, index) => (
            <div key={index} className="text-center bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4 md:p-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 md:p-3 rounded-xl w-fit mx-auto mb-2 md:mb-3">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-white font-bold mb-1 text-sm md:text-base">{item.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
