
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Rocket, DollarSign, Users, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function FacebookAdsPage() {
  const [loading, setLoading] = useState(false);
  const [campaignData, setCampaignData] = useState({
    campaignName: "Kreative Intelligence - Website Services",
    objective: "LEAD_GENERATION",
    dailyBudget: 50,
    headline: "Professional Website Design - $997",
    description: "Get a custom, mobile-responsive website built by experts. Fast turnaround, no templates. Book your free consultation today!",
    imageUrl: "https://kreativeaiagency.com/portfolio/kreative-web-agency.jpg",
    destinationUrl: "https://kreativeaiagency.com/get-quote",
    locations: "US",
    ageMin: 25,
    ageMax: 65,
  });

  const createCampaign = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/facebook-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_campaign",
          campaignName: campaignData.campaignName,
          objective: campaignData.objective,
          dailyBudget: campaignData.dailyBudget * 100, // Convert to cents
          targeting: {
            locations: [campaignData.locations],
            ageMin: campaignData.ageMin,
            ageMax: campaignData.ageMax,
            interests: [
              "Small business",
              "Entrepreneurship",
              "Web design",
              "Digital marketing",
            ],
          },
          adCreative: {
            headline: campaignData.headline,
            description: campaignData.description,
            imageUrl: campaignData.imageUrl,
            callToAction: "LEARN_MORE",
            destinationUrl: campaignData.destinationUrl,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Campaign created and launched successfully!");
      } else {
        toast.error(data.error || "Failed to create campaign");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Facebook Ads Manager</h1>
        <p className="text-muted-foreground">
          Create and manage automated Facebook ad campaigns
        </p>
      </div>

      {/* Alert about API setup */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900 mb-1">
                Facebook Business Manager Setup Required
              </h4>
              <p className="text-sm text-orange-800">
                To use automated Facebook ads, you need to configure your Facebook Business API credentials.
                Once configured, campaigns will run autonomously and you'll only be notified when a deal closes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Create Automated Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Basics */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                value={campaignData.campaignName}
                onChange={(e) =>
                  setCampaignData({ ...campaignData, campaignName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Campaign Objective</Label>
              <Select
                value={campaignData.objective}
                onValueChange={(value) =>
                  setCampaignData({ ...campaignData, objective: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEAD_GENERATION">Lead Generation</SelectItem>
                  <SelectItem value="CONVERSIONS">Conversions</SelectItem>
                  <SelectItem value="TRAFFIC">Traffic</SelectItem>
                  <SelectItem value="REACH">Reach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Daily Budget ($)</Label>
              <Input
                type="number"
                value={campaignData.dailyBudget}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    dailyBudget: parseInt(e.target.value) || 0,
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                Recommended: $30-50/day for lead generation
              </p>
            </div>
          </div>

          {/* Ad Creative */}
          <div className="space-y-4">
            <h4 className="font-semibold">Ad Creative</h4>

            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                value={campaignData.headline}
                onChange={(e) =>
                  setCampaignData({ ...campaignData, headline: e.target.value })
                }
                maxLength={40}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={campaignData.description}
                onChange={(e) =>
                  setCampaignData({ ...campaignData, description: e.target.value })
                }
                maxLength={125}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={campaignData.imageUrl}
                onChange={(e) =>
                  setCampaignData({ ...campaignData, imageUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Destination URL</Label>
              <Input
                value={campaignData.destinationUrl}
                onChange={(e) =>
                  setCampaignData({ ...campaignData, destinationUrl: e.target.value })
                }
              />
            </div>
          </div>

          {/* Targeting */}
          <div className="space-y-4">
            <h4 className="font-semibold">Audience Targeting</h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={campaignData.locations}
                  onValueChange={(value) =>
                    setCampaignData({ ...campaignData, locations: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age Min</Label>
                <Input
                  type="number"
                  value={campaignData.ageMin}
                  onChange={(e) =>
                    setCampaignData({
                      ...campaignData,
                      ageMin: parseInt(e.target.value) || 18,
                    })
                  }
                  min={18}
                  max={65}
                />
              </div>

              <div className="space-y-2">
                <Label>Age Max</Label>
                <Input
                  type="number"
                  value={campaignData.ageMax}
                  onChange={(e) =>
                    setCampaignData({
                      ...campaignData,
                      ageMax: parseInt(e.target.value) || 65,
                    })
                  }
                  min={18}
                  max={65}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Auto-Targeting</Label>
              <div className="flex flex-wrap gap-2">
                <Badge>Small Business</Badge>
                <Badge>Entrepreneurship</Badge>
                <Badge>Web Design</Badge>
                <Badge>Digital Marketing</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Automated interest targeting for lead generation
              </p>
            </div>
          </div>

          {/* Launch Button */}
          <Button
            onClick={createCampaign}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            <Rocket className="mr-2 h-5 w-5" />
            {loading ? "Creating Campaign..." : "Launch Campaign"}
          </Button>
        </CardContent>
      </Card>

      {/* Campaign Performance - Placeholder */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost/Lead</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
