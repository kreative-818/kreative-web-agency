
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, User, Building, Globe, Clock, DollarSign, Mail, Phone, MessageSquare } from "lucide-react";

const LeadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    currentWebsiteUrl: "",
    servicesInterested: [] as string[],
    projectTimeline: "",
    budgetRange: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    additionalDetails: "",
  });

  const { toast } = useToast();

  const serviceOptions = [
    "Website Development",
    "Web Application Development", 
    "Automation Services",
    "Website Redesign",
    "SEO Services",
    "Hosting & Maintenance",
  ];

  const timelineOptions = [
    { value: "asap", label: "ASAP (Rush Job)" },
    { value: "1-2-weeks", label: "1-2 Weeks" },
    { value: "1-month", label: "Within 1 Month" },
    { value: "2-3-months", label: "2-3 Months" },
    { value: "flexible", label: "Flexible Timeline" },
  ];

  const budgetOptions = [
    { value: "basic", label: "Basic Package ($997 + $97/mo)" },
    { value: "pro", label: "Pro Package ($1,997 + $197/mo)" },
    { value: "premium", label: "Premium Package ($3,997 + $297/mo)" },
    { value: "custom", label: "Custom Solution (Let's Discuss)" },
  ];

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      servicesInterested: checked 
        ? [...prev.servicesInterested, service]
        : prev.servicesInterested.filter(s => s !== service)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.businessName || !formData.businessType || !formData.contactName || 
          !formData.contactEmail || !formData.contactPhone || formData.servicesInterested.length === 0 ||
          !formData.projectTimeline || !formData.budgetRange) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: "Your request has been submitted. We'll contact you within 24 hours.",
      });

      // Reset form
      setFormData({
        businessName: "",
        businessType: "",
        currentWebsiteUrl: "",
        servicesInterested: [],
        projectTimeline: "",
        budgetRange: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        additionalDetails: "",
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700"
    >
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
          <Send className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Project Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Business Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName" className="text-gray-300">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pl-10"
                placeholder="Your business name"
                required
              />
              <Building className="w-4 h-4 text-gray-400 absolute left-3 top-[38px]" />
            </div>
            <div>
              <Label htmlFor="businessType" className="text-gray-300">Business Type *</Label>
              <Input
                id="businessType"
                value={formData.businessType}
                onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pl-10"
                placeholder="e.g., Restaurant, E-commerce, Consulting"
                required
              />
              <Building className="w-4 h-4 text-gray-400 absolute left-3 top-[38px]" />
            </div>
          </div>

          <div>
            <Label htmlFor="currentWebsiteUrl" className="text-gray-300">Current Website URL (if any)</Label>
            <Input
              id="currentWebsiteUrl"
              type="url"
              value={formData.currentWebsiteUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, currentWebsiteUrl: e.target.value }))}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pl-10"
              placeholder="https://yourwebsite.com"
            />
            <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-[38px]" />
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Services Needed *</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {serviceOptions.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={formData.servicesInterested.includes(service)}
                  onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                  className="border-gray-600"
                />
                <Label htmlFor={service} className="text-gray-300 text-sm">{service}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline and Budget */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Project Timeline *</Label>
            <Select value={formData.projectTimeline} onValueChange={(value) => setFormData(prev => ({ ...prev, projectTimeline: value }))}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {timelineOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-300">Budget Range *</Label>
            <Select value={formData.budgetRange} onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}>
              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {budgetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Contact Information
          </h3>
          
          <div>
            <Label htmlFor="contactName" className="text-gray-300">Full Name *</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pl-10"
              placeholder="Your full name"
              required
            />
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-[38px]" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail" className="text-gray-300">Email Address *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pl-10"
                placeholder="your@email.com"
                required
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-[38px]" />
            </div>
            <div>
              <Label htmlFor="contactPhone" className="text-gray-300">Phone Number *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pl-10"
                placeholder="(555) 123-4567"
                required
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-[38px]" />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <Label htmlFor="additionalDetails" className="text-gray-300">Additional Details</Label>
          <Textarea
            id="additionalDetails"
            value={formData.additionalDetails}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px] pl-10"
            placeholder="Tell us more about your project, specific requirements, or any questions you have..."
          />
          <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-[38px]" />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Project Request
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default LeadForm;
