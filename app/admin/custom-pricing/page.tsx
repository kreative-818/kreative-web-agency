
"use client";

import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DollarSign, Copy, Check, Link as LinkIcon } from "lucide-react";

/**
 * Admin page to create custom Stripe payment links with special pricing
 * 
 * Use cases:
 * - Special discounts for specific clients
 * - Custom package bundles
 * - Enterprise pricing
 * - Payment plans (deposit, installments)
 */
export default function CustomPricingPage() {
  const [formData, setFormData] = useState({
    packageName: "",
    customAmount: "",
    customerEmail: "",
    customerName: "",
    description: "",
    paymentPlanType: "full",
    installmentCount: "3",
  });

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    // Validation
    if (!formData.packageName || !formData.customAmount || !formData.customerEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.customAmount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (formData.paymentPlanType === "installments" && parseInt(formData.installmentCount) < 2) {
      toast.error("Installment count must be at least 2");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/admin/create-custom-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageName: formData.packageName,
          customAmount: parseFloat(formData.customAmount),
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
          description: formData.description,
          paymentPlanType: formData.paymentPlanType,
          installmentCount: formData.paymentPlanType === "installments" 
            ? parseInt(formData.installmentCount) 
            : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.checkoutUrl) {
        setGeneratedUrl(data.checkoutUrl);
        toast.success("Payment link generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate payment link");
      }
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate payment link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Payment link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Custom Payment Link Generator</h1>
        <p className="text-gray-600">
          Create special pricing and payment plans for specific clients. These links are NOT listed
          on your website and can only be accessed by those you share them with.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Create Custom Pricing
          </CardTitle>
          <CardDescription>
            Generate a unique Stripe checkout link with custom pricing and payment terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Package Name */}
          <div className="space-y-2">
            <Label htmlFor="packageName">
              Package Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="packageName"
              placeholder="e.g., Enterprise Website + AI Chatbot Bundle"
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
            />
          </div>

          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerEmail">
                Customer Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="client@example.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                placeholder="John Smith"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="customAmount">
              Amount (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customAmount"
              type="number"
              placeholder="2500.00"
              min="0"
              step="0.01"
              value={formData.customAmount}
              onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
            />
            <p className="text-sm text-gray-600">
              Enter the total amount in dollars (e.g., 2997 for $2,997.00)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Custom package including: 10-page website, AI chatbot, 6 months support..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Payment Plan Type */}
          <div className="space-y-2">
            <Label htmlFor="paymentPlanType">Payment Plan Type</Label>
            <Select
              value={formData.paymentPlanType}
              onValueChange={(value) => setFormData({ ...formData, paymentPlanType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Payment (One-time)</SelectItem>
                <SelectItem value="deposit">50% Deposit (Balance due on completion)</SelectItem>
                <SelectItem value="installments">Monthly Installments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Installment Count (only if installments selected) */}
          {formData.paymentPlanType === "installments" && (
            <div className="space-y-2">
              <Label htmlFor="installmentCount">Number of Monthly Payments</Label>
              <Select
                value={formData.installmentCount}
                onValueChange={(value) => setFormData({ ...formData, installmentCount: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 months</SelectItem>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="4">4 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                </SelectContent>
              </Select>
              {formData.customAmount && (
                <p className="text-sm text-gray-600">
                  Monthly payment: ${(parseFloat(formData.customAmount) / parseInt(formData.installmentCount)).toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Payment Plan Summary */}
          {formData.paymentPlanType === "deposit" && formData.customAmount && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">Payment Plan Summary:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Deposit: ${(parseFloat(formData.customAmount) / 2).toFixed(2)} (paid now)</li>
                <li>• Balance: ${(parseFloat(formData.customAmount) / 2).toFixed(2)} (due on completion)</li>
              </ul>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? "Generating..." : "Generate Payment Link"}
          </Button>

          {/* Generated URL */}
          {generatedUrl && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-900 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Payment Link Generated!
                </h3>
              </div>
              <div className="flex gap-2">
                <Input
                  value={generatedUrl}
                  readOnly
                  className="bg-white"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="icon"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(generatedUrl, "_blank")}
                  variant="outline"
                  className="flex-1"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Open Link
                </Button>
                <Button
                  onClick={() => {
                    const subject = encodeURIComponent(`Payment Link - ${formData.packageName}`);
                    const body = encodeURIComponent(
                      `Hi ${formData.customerName || "there"},\n\nHere's your custom payment link for ${formData.packageName}:\n\n${generatedUrl}\n\nBest regards,\nKreative Intelligence`
                    );
                    window.open(
                      `mailto:${formData.customerEmail}?subject=${subject}&body=${body}`
                    );
                  }}
                  variant="default"
                  className="flex-1"
                >
                  Email to Customer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>🎯 When to Use Custom Pricing:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Special discount for referrals or repeat clients</li>
              <li>Custom package bundles not listed on website</li>
              <li>Enterprise clients with specific requirements</li>
              <li>Payment plans for high-value projects</li>
              <li>Early bird pricing for new services</li>
            </ul>
          </div>
          <div>
            <strong>💡 Best Practices:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Always include a clear description of what's included</li>
              <li>For deposits, communicate clearly when balance is due</li>
              <li>Keep records of custom pricing agreements</li>
              <li>Use installments for projects over $5,000</li>
              <li>Send the link directly via email, don't post publicly</li>
            </ul>
          </div>
          <div>
            <strong>🔒 Security Note:</strong>
            <p className="mt-1">
              These links are NOT indexed or accessible from your website. They can only be used by
              people you share them with. Each link is unique and secure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
