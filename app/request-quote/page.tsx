
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  User,
  Briefcase,
  Target,
  DollarSign,
  Calendar,
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

type QuoteFormData = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  projectType: string;
  budget: string;
  timeline: string;
  challenge: string;
  goals: string;
};

const INITIAL_FORM_DATA: QuoteFormData = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  businessType: "",
  projectType: "",
  budget: "",
  timeline: "",
  challenge: "",
  goals: "",
};

export default function RequestQuotePage() {
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all contact information");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    if (!formData.projectType) {
      toast.error("Please select a project type");
      return false;
    }

    if (!formData.budget) {
      toast.error("Please select your budget range");
      return false;
    }

    if (!formData.timeline) {
      toast.error("Please select your timeline");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Quote request received! We'll contact you soon.");
        
        // Show next steps based on budget
        const budgetValue = parseInt(formData.budget.replace(/[^0-9]/g, ""));
        if (budgetValue >= 2500) {
          toast.success("High-priority lead! Expect a call within 5 minutes.", {
            duration: 5000,
          });
        } else {
          toast.success("We'll review your request and get back within 24 hours.", {
            duration: 5000,
          });
        }

        // Redirect to thank you page
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 2000);
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Quote submission error:", error);
      toast.error("Failed to submit. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 px-6 py-3 text-lg">
            <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
            Get Your Custom Quote
          </Badge>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Let's Build Something
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Tell us about your project and we'll create a{" "}
            <span className="text-blue-400 font-bold">custom solution</span>{" "}
            tailored to your goals and budget
          </p>
        </div>

        {/* Main Form */}
        <Card className="bg-gray-900/50 border-2 border-gray-800 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Contact Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white text-base mb-2 block flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Your Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12 text-base focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white text-base mb-2 block flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@yourcompany.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12 text-base focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-white text-base mb-2 block flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12 text-base focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessName" className="text-white text-base mb-2 block flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Business Name
                    </Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Your Company LLC"
                      value={formData.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white h-12 text-base focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Project Details
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white text-base mb-2 block">
                      Business Type
                    </Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => updateField("businessType", value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12 text-base focus:border-blue-500">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant / Food Service</SelectItem>
                        <SelectItem value="contractor">Contractor / Construction</SelectItem>
                        <SelectItem value="retail">Retail / E-commerce</SelectItem>
                        <SelectItem value="service">Professional Services</SelectItem>
                        <SelectItem value="healthcare">Healthcare / Medical</SelectItem>
                        <SelectItem value="realestate">Real Estate</SelectItem>
                        <SelectItem value="salon">Salon / Beauty</SelectItem>
                        <SelectItem value="fitness">Fitness / Wellness</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="tech">Technology / Software</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-base mb-2 block">
                      Project Type *
                    </Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => updateField("projectType", value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12 text-base focus:border-blue-500">
                        <SelectValue placeholder="What do you need?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-website">New Website</SelectItem>
                        <SelectItem value="redesign">Website Redesign</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce Store</SelectItem>
                        <SelectItem value="web-app">Web Application</SelectItem>
                        <SelectItem value="landing-page">Landing Page</SelectItem>
                        <SelectItem value="seo">SEO & Marketing</SelectItem>
                        <SelectItem value="automation">AI & Automation</SelectItem>
                        <SelectItem value="maintenance">Website Maintenance</SelectItem>
                        <SelectItem value="not-sure">Not Sure / Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white text-base mb-2 block flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Budget Range *
                    </Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => updateField("budget", value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12 text-base focus:border-blue-500">
                        <SelectValue placeholder="Select your budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                        <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                        <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10000+">$10,000+</SelectItem>
                        <SelectItem value="not-sure">Not Sure Yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-base mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Timeline *
                    </Label>
                    <Select
                      value={formData.timeline}
                      onValueChange={(value) => updateField("timeline", value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-12 text-base focus:border-blue-500">
                        <SelectValue placeholder="When do you need this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP (1-2 weeks)</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="2-3-months">2-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="flexible">Flexible / Exploring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="challenge" className="text-white text-base mb-2 block flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    What's Your Biggest Challenge?
                  </Label>
                  <Textarea
                    id="challenge"
                    placeholder="Tell us about the problem you're trying to solve..."
                    value={formData.challenge}
                    onChange={(e) => updateField("challenge", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white min-h-[100px] text-base focus:border-blue-500 transition-colors"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="goals" className="text-white text-base mb-2 block flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    What Are Your Goals?
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="What does success look like for this project?"
                    value={formData.goals}
                    onChange={(e) => updateField("goals", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white min-h-[100px] text-base focus:border-blue-500 transition-colors"
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 text-lg font-bold shadow-2xl shadow-blue-500/50 transition-all transform hover:scale-[1.02]"
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Get My Custom Quote
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-400 mt-4">
                  We typically respond within 5 minutes during business hours
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
            <div className="text-3xl font-black text-blue-400 mb-1">5 Min</div>
            <div className="text-sm text-gray-400">Response Time</div>
          </div>
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
            <div className="text-3xl font-black text-purple-400 mb-1">100+</div>
            <div className="text-sm text-gray-400">Happy Clients</div>
          </div>
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
            <div className="text-3xl font-black text-pink-400 mb-1">24/7</div>
            <div className="text-sm text-gray-400">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
}
