
"use client";

import { useState, useRef } from "react";
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
import { Check, ArrowRight, Zap, Shield, Clock, Rocket } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type QuoteFormData = {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  projectDescription: string;
  budget: string;
};

const INITIAL_FORM: QuoteFormData = {
  fullName: "",
  email: "",
  phone: "",
  projectType: "",
  projectDescription: "",
  budget: "",
};

export default function QuoteLandingPage() {
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateField = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in your name and email");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
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
        body: JSON.stringify({
          ...formData,
          source: "Quote Landing Page",
          name: formData.fullName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Quote request received! Redirecting...");
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 1500);
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Quote submission error:", error);
      toast.error("Failed to submit. Please try again or call us at (984) 400-9443.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo-transparent.png"
                  alt="Kreative Intelligence"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-slate-900">Kreative Intelligence</span>
            </div>
            <Button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              Get My Free Quote
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Get a Website That Brings You{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Leads — Not Headaches
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Done-for-you websites, web apps, and automations built fast for North Carolina businesses.
          </p>
          <Button
            onClick={scrollToForm}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-14 px-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Get My Free Quote
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Pain / Promise Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
            Your Business Deserves More Than a Template
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                pain: "No time to figure out tech?",
                promise: "We build it for you.",
                icon: Clock,
              },
              {
                pain: "Website not bringing results?",
                promise: "We design for conversions.",
                icon: Zap,
              },
              {
                pain: "Need something that just works?",
                promise: "We make it simple, fast, and done.",
                icon: Shield,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-lg font-semibold text-slate-900 mb-2">
                  ❌ {item.pain}
                </p>
                <p className="text-lg font-bold text-green-600">
                  ✅ {item.promise}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Tell us what you need",
                description: "Fill the short form below",
              },
              {
                step: "2",
                title: "We design your plan",
                description: "Tailored to your goals and budget",
              },
              {
                step: "3",
                title: "You launch confidently",
                description: "We handle tech, you handle growth",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section ref={formRef} className="py-20 px-4 bg-white scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Get Your Free Quote
            </h2>
            <p className="text-lg text-slate-600">
              Tell us about your project and we'll get back to you within 24 hours
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 space-y-6"
          >
            <div>
              <Label htmlFor="fullName" className="text-slate-900 text-base mb-2 block">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="bg-white border-slate-300 text-slate-900 h-12 text-base"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="text-slate-900 text-base mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 h-12 text-base"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-900 text-base mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 h-12 text-base"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-900 text-base mb-2 block">
                Project Type *
              </Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => updateField("projectType", value)}
              >
                <SelectTrigger className="bg-white border-slate-300 text-slate-900 h-12 text-base">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="web-app">Web App</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="projectDescription" className="text-slate-900 text-base mb-2 block">
                Describe Your Project
              </Label>
              <Textarea
                id="projectDescription"
                placeholder="Tell us what you need..."
                value={formData.projectDescription}
                onChange={(e) => updateField("projectDescription", e.target.value)}
                className="bg-white border-slate-300 text-slate-900 min-h-[120px] text-base"
                rows={5}
              />
            </div>

            <div>
              <Label className="text-slate-900 text-base mb-2 block">
                Budget Range *
              </Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => updateField("budget", value)}
              >
                <SelectTrigger className="bg-white border-slate-300 text-slate-900 h-12 text-base">
                  <SelectValue placeholder="Select your budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500-1000">$500 – $1,000</SelectItem>
                  <SelectItem value="1000-2500">$1,000 – $2,500</SelectItem>
                  <SelectItem value="2500+">$2,500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              {submitting ? "Submitting..." : "Request My Quote"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
            Trusted by North Carolina Businesses
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Loved by churches, daycares, auto shops, and small business owners across NC
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-6 py-3 text-lg font-semibold text-blue-700">
            <Check className="w-5 h-5" />
            Serving all of North Carolina
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Fast Delivery", desc: "7-14 days" },
            { icon: Shield, title: "Money-Back Guarantee", desc: "30 days" },
            { icon: Clock, title: "Quick Response", desc: "Within 24 hrs" },
            { icon: Rocket, title: "13+ Active Clients", desc: "Proven results" },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl w-fit mx-auto mb-3">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-slate-400">
            © 2025 Kreative Web Agency | Goldsboro, NC | Built with Faith & Innovation
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-600">•</span>
            <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>

      {/* Sticky CTA Button (Mobile) */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <Button
          onClick={scrollToForm}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 text-lg font-bold shadow-2xl"
        >
          Get a Free Quote
        </Button>
      </div>
    </div>
  );
}
