
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProjectIntakeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get package info from URL params
  const selectedPackage = searchParams.get("package") || "";
  const packagePrice = searchParams.get("price") || "";
  const billingPeriod = searchParams.get("billing") || "monthly";
  const retainerPrice = searchParams.get("retainer") || "";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Contact Information
    name: "",
    email: "",
    phone: "",
    businessName: "",
    
    // Project Details
    packageId: selectedPackage,
    projectType: getProjectTypeFromPackage(selectedPackage),
    timeline: "",
    budget: packagePrice,
    billingPeriod: billingPeriod,
    retainerPrice: retainerPrice,
    
    // Project Requirements
    description: "",
    goals: "",
    targetAudience: "",
    
    // Features (checkboxes)
    features: [] as string[],
    
    // Upsells
    upsells: [] as string[],
    
    // Additional Notes
    additionalNotes: "",
    referralSource: "",
  });

  function getProjectTypeFromPackage(pkg: string): string {
    if (pkg.includes("website")) return "website";
    if (pkg.includes("webapp")) return "web-application";
    if (pkg.includes("automation")) return "automation";
    return "";
  }

  function getPackageName(pkg: string): string {
    if (!pkg) return "Custom Package";
    const parts = pkg.split("_");
    const type = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const tier = parts[1]?.charAt(0).toUpperCase() + parts[1]?.slice(1);
    return `${type} - ${tier}` || "Custom Package";
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = formData.features.includes(feature)
      ? formData.features.filter((f) => f !== feature)
      : [...formData.features, feature];
    setFormData({ ...formData, features: newFeatures });
  };

  const handleUpsellToggle = (upsellId: string) => {
    const newUpsells = formData.upsells.includes(upsellId)
      ? formData.upsells.filter((u) => u !== upsellId)
      : [...formData.upsells, upsellId];
    setFormData({ ...formData, upsells: newUpsells });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.businessName) {
        toast.error("Please fill in all required contact information");
        setLoading(false);
        return;
      }

      // Submit project request
      const response = await fetch("/api/leads/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit project request");
      }

      const { success } = await response.json();
      
      if (success) {
        toast.success("Request submitted! We'll reach out within 24 hours.");
        // Redirect to thank you page
        router.push("/thank-you");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again or call us at (984) 400-9443");
      setLoading(false);
    }
  };

  const commonFeatures = [
    "Contact Form",
    "Newsletter Signup",
    "Blog/News Section",
    "Photo Gallery",
    "Video Integration",
    "Social Media Integration",
    "Live Chat Support",
    "Appointment Booking",
    "E-commerce/Shop",
    "Member Login Area",
    "Search Functionality",
    "Multi-language Support",
  ];

  // Define upsell options based on selected package
  const getUpsellOptions = () => {
    const isBasicWebsite = selectedPackage.includes("website_basic");
    const isProfessionalWebsite = selectedPackage.includes("website_professional");
    const isPremiumWebsite = selectedPackage.includes("website_premium");
    const isWebApp = selectedPackage.includes("webapp");
    const isAutomation = selectedPackage.includes("automation");

    const upsells = [];

    // Advanced SEO Package - only for Basic (Professional+ already has GMB optimization)
    if (isBasicWebsite) {
      upsells.push({
        id: "seo_package",
        name: "Advanced SEO Package",
        price: 750,
        description: "Keyword research, competitor analysis, Google My Business setup",
        reason: "Get found on Google faster and rank higher than competitors",
        icon: "🔍",
      });
    }

    // Sona AI Phone System - only for Basic (Professional+ already has it)
    if (isBasicWebsite) {
      upsells.push({
        id: "phone_system",
        name: "Sona AI Phone System",
        price: 500,
        description: "24/7 AI phone assistant that qualifies leads and answers questions",
        reason: "Never miss a call - even when you're sleeping or busy",
        icon: "📞",
      });
    }

    // Social Media Management - relevant for all except Premium (which has automation)
    if (!isPremiumWebsite) {
      upsells.push({
        id: "social_media",
        name: "Social Media Management (3 months)",
        price: 750,
        monthlyPrice: 250,
        description: "Account setup, content creation, and 3 posts per week",
        reason: "Build your brand and reach customers where they spend their time",
        icon: "📱",
      });
    }

    // Extra Blog Content - only for Basic (Professional gets 3, Premium gets 4/month)
    if (isBasicWebsite) {
      upsells.push({
        id: "blog_content",
        name: "SEO Blog Content Package",
        price: 500,
        description: "5 professionally written, SEO-optimized articles",
        reason: "Dominate Google with fresh, keyword-rich content",
        icon: "✍️",
      });
    }

    // Email Marketing Setup - relevant for all packages
    upsells.push({
      id: "email_marketing",
      name: "Email Marketing Setup",
      price: 300,
      description: "Newsletter automation, templates, and welcome sequence",
      reason: "Turn one-time visitors into repeat customers",
      icon: "✉️",
    });

    // E-commerce Upgrade - only for Basic (Professional is e-commerce ready)
    if (isBasicWebsite) {
      upsells.push({
        id: "ecommerce",
        name: "E-commerce Upgrade",
        price: 400,
        description: "Online store with up to 25 products, shopping cart, and checkout",
        reason: "Start selling online and reach customers 24/7",
        icon: "🛒",
      });
    }

    // Priority Support Upgrade - only for Basic
    if (isBasicWebsite || selectedPackage.includes("automation_basic")) {
      upsells.push({
        id: "priority_support",
        name: "Priority Support Upgrade (6 months)",
        price: 300,
        monthlyPrice: 50,
        description: "4-hour response time + 1 hour of updates per month",
        reason: "Get help when you need it most, with faster turnaround",
        icon: "🚀",
      });
    }

    return upsells;
  };

  const upsellOptions = getUpsellOptions();

  // Calculate total with upsells
  const calculateTotal = () => {
    const basePrice = parseInt(packagePrice) || 0;
    const upsellTotal = upsellOptions
      .filter((u) => formData.upsells.includes(u.id))
      .reduce((sum, u) => sum + u.price, 0);
    return basePrice + upsellTotal;
  };

  return (
    <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl text-slate-900">Project Details</CardTitle>
        <CardDescription className="text-slate-600">
          Tell us about your project so we can customize your experience
        </CardDescription>
        {selectedPackage && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
            <div className="text-blue-700 font-semibold">Selected Package: {getPackageName(selectedPackage)}</div>
            <div className="flex flex-col gap-1 text-slate-700">
              <div>Initial Investment: <span className="font-bold text-slate-900">${packagePrice ? parseInt(packagePrice).toLocaleString() : "Custom"}</span></div>
              {retainerPrice && parseInt(retainerPrice) > 0 && (
                <div>
                  Support & Maintenance: <span className="font-bold text-green-600">${parseInt(retainerPrice).toLocaleString()}</span>
                  <span className="text-slate-600 text-sm ml-1">
                    /{billingPeriod === 'yearly' ? 'year' : 'month'}
                  </span>
                  {billingPeriod === 'yearly' && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                      15% savings
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@company.com"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(555) 123-4567"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="businessName">Business/Organization Name *</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  placeholder="Acme Corporation"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Project Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeline">Desired Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => handleSelectChange("timeline", value)}>
                  <SelectTrigger className="bg-white border-slate-300 [&>span]:text-slate-900 data-[placeholder]:text-slate-500">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">As soon as possible</SelectItem>
                    <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-2months">1-2 months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <Select value={formData.referralSource} onValueChange={(value) => handleSelectChange("referralSource", value)}>
                  <SelectTrigger className="bg-white border-slate-300 [&>span]:text-slate-900 data-[placeholder]:text-slate-500">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Tell Us About Your Project</h3>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project, what you need, and any specific requirements..."
                rows={4}
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-600"
              />
            </div>
            <div>
              <Label htmlFor="goals">What are your main goals?</Label>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                placeholder="e.g., Increase sales, improve brand awareness, automate processes..."
                rows={3}
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-600"
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">Who is your target audience?</Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="e.g., Small business owners, local customers, B2B clients..."
                className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Desired Features (select all that apply)</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {commonFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes">Additional Notes or Questions</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              placeholder="Any other information you'd like to share..."
              rows={3}
              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-600"
            />
          </div>

          {/* Upsells Section */}
          {upsellOptions.length > 0 && (
            <div className="space-y-4 border-t border-slate-200 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Boost Your Results (Optional Add-Ons)</h3>
                  <p className="text-sm text-slate-600 mt-1">Select services to accelerate your growth</p>
                </div>
                {formData.upsells.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Add-ons Total:</p>
                    <p className="text-2xl font-bold text-green-600">
                      +${upsellOptions
                        .filter((u) => formData.upsells.includes(u.id))
                        .reduce((sum, u) => sum + u.price, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                {upsellOptions.map((upsell) => (
                  <div
                    key={upsell.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      formData.upsells.includes(upsell.id)
                        ? "bg-blue-50 border-blue-300"
                        : "bg-slate-50 border-slate-200 hover:border-blue-200"
                    }`}
                    onClick={() => handleUpsellToggle(upsell.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={upsell.id}
                        checked={formData.upsells.includes(upsell.id)}
                        onCheckedChange={() => handleUpsellToggle(upsell.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{upsell.icon}</span>
                            <span className="text-base font-semibold cursor-pointer text-slate-900">
                              {upsell.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600">${upsell.price}</span>
                            {upsell.monthlyPrice && (
                              <span className="text-xs text-slate-600 ml-1">
                                (${upsell.monthlyPrice}/mo)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-slate-700 mb-2">{upsell.description}</div>
                        <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-100 rounded px-3 py-2 border border-blue-200">
                          <span className="mt-0.5">💡</span>
                          <span>
                            <strong>Why add this?</strong> {upsell.reason}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-600">Total Investment:</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Base package: ${parseInt(packagePrice).toLocaleString()}
                      {formData.upsells.length > 0 && ` + Add-ons`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">${calculateTotal().toLocaleString()}</p>
                    {retainerPrice && parseInt(retainerPrice) > 0 && (
                      <p className="text-xs text-slate-600 mt-1">
                        + ${parseInt(retainerPrice).toLocaleString()}/{billingPeriod === 'yearly' ? 'year' : 'month'} support
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          <p className="text-xs text-slate-500 text-center">
            We'll review your request and reach out within 24 hours to discuss next steps.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
