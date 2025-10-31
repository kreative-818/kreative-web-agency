
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Upload, Palette, FileText, Globe } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type OnboardingData = {
  businessDescription: string;
  targetAudience: string;
  brandColors: string;
  competitorWebsites: string;
  servicesOffered: string;
  specialRequests: string;
  logoFile: File | null;
};

const INITIAL_DATA: OnboardingData = {
  businessDescription: "",
  targetAudience: "",
  brandColors: "",
  competitorWebsites: "",
  servicesOffered: "",
  specialRequests: "",
  logoFile: null
};

export default function OnboardingPage() {
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const updateField = (field: keyof OnboardingData, value: string | File | null) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateField("logoFile", file);
  };

  const validateForm = (): boolean => {
    if (!data.businessDescription || data.businessDescription.length < 50) {
      toast.error("Please provide a detailed business description (at least 50 characters)");
      return false;
    }
    if (!data.targetAudience) {
      toast.error("Please tell us about your target audience");
      return false;
    }
    if (!data.servicesOffered) {
      toast.error("Please list the services you offer");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const response = await fetch("/api/onboarding/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        toast.success("Onboarding complete! We'll start building your site.");
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-24">
        <Card className="max-w-2xl w-full bg-gray-900 border-gray-800 text-center">
          <CardContent className="pt-12 pb-12">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">All Set! 🎉</h1>
            <p className="text-xl text-gray-400 mb-8">
              Thank you for completing your onboarding. Our team will start building your website right away!
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Let's Build Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Perfect Website</span>
          </h1>
          <p className="text-xl text-gray-400">
            Tell us about your business so we can create exactly what you need
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Website Onboarding Form</CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              The more details you provide, the better we can tailor your site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Business Description */}
            <div>
              <Label htmlFor="businessDescription" className="text-white text-lg mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Business Description *
              </Label>
              <Textarea
                id="businessDescription"
                placeholder="Tell us about your business, what you do, your mission, and what makes you unique..."
                value={data.businessDescription}
                onChange={(e) => updateField("businessDescription", e.target.value)}
                rows={6}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                {data.businessDescription.length}/500 characters (minimum 50)
              </p>
            </div>

            {/* Target Audience */}
            <div>
              <Label htmlFor="targetAudience" className="text-white text-lg mb-2 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Target Audience *
              </Label>
              <Textarea
                id="targetAudience"
                placeholder="Who are your ideal customers? Age range, location, interests, pain points..."
                value={data.targetAudience}
                onChange={(e) => updateField("targetAudience", e.target.value)}
                rows={4}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Services Offered */}
            <div>
              <Label htmlFor="servicesOffered" className="text-white text-lg mb-2 block">
                Services/Products You Offer *
              </Label>
              <Textarea
                id="servicesOffered"
                placeholder="List your main services or products, one per line..."
                value={data.servicesOffered}
                onChange={(e) => updateField("servicesOffered", e.target.value)}
                rows={5}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Brand Colors */}
            <div>
              <Label htmlFor="brandColors" className="text-white text-lg mb-2 flex items-center gap-2">
                <Palette className="w-5 h-5 text-green-400" />
                Brand Colors (Optional)
              </Label>
              <Input
                id="brandColors"
                type="text"
                placeholder="e.g., Blue and Gold, #FF5733, or 'I don't have brand colors yet'"
                value={data.brandColors}
                onChange={(e) => updateField("brandColors", e.target.value)}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                List hex codes, color names, or let us know if you need help choosing
              </p>
            </div>

            {/* Logo Upload */}
            <div>
              <Label htmlFor="logoFile" className="text-white text-lg mb-2 flex items-center gap-2">
                <Upload className="w-5 h-5 text-yellow-400" />
                Upload Your Logo (Optional)
              </Label>
              <Input
                id="logoFile"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
              />
              {data.logoFile && (
                <p className="text-sm text-green-400 mt-2">✓ {data.logoFile.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, or PDF. If you don't have one, we'll help you create it!
              </p>
            </div>

            {/* Competitor Websites */}
            <div>
              <Label htmlFor="competitorWebsites" className="text-white text-lg mb-2 block">
                Competitor or Inspiration Websites (Optional)
              </Label>
              <Textarea
                id="competitorWebsites"
                placeholder="List websites you like or competitors, one per line..."
                value={data.competitorWebsites}
                onChange={(e) => updateField("competitorWebsites", e.target.value)}
                rows={4}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests" className="text-white text-lg mb-2 block">
                Special Requests or Additional Notes (Optional)
              </Label>
              <Textarea
                id="specialRequests"
                placeholder="Anything else we should know? Specific features, design preferences, etc..."
                value={data.specialRequests}
                onChange={(e) => updateField("specialRequests", e.target.value)}
                rows={5}
                className="mt-2 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 text-lg font-bold"
              >
                {submitting ? "Submitting..." : "Submit Onboarding Form"}
                <CheckCircle className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
