
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Instagram, Facebook, Linkedin, Sparkles, Send, Clock } from "lucide-react";
import { toast } from "sonner";

interface ContentIdea {
  type: string;
  platform: string;
  title: string;
  description: string;
  suggestedDate: string;
  hashtags: string[];
  callToAction: string;
  priority: string;
}

export default function SocialMediaPage() {
  const [calendar, setCalendar] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  
  // Form states
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [contentType, setContentType] = useState("educational");
  const [customContent, setCustomContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Load content calendar
  useEffect(() => {
    loadContentCalendar();
  }, []);

  const loadContentCalendar = async () => {
    try {
      const response = await fetch("/api/social-media/schedule");
      const data = await response.json();
      if (data.success) {
        setCalendar(data.calendar);
      }
    } catch (error) {
      console.error("Failed to load calendar:", error);
    }
  };

  const generateAIContent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/social-media/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_content",
          platform: selectedPlatform,
          contentType,
          tone: "professional",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedContent(data.content);
        setCustomContent(data.content);
        toast.success("Content generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const postToSocialMedia = async (scheduleLater = false) => {
    if (!customContent) {
      toast.error("Please enter or generate content first");
      return;
    }

    if (selectedPlatform === "instagram" && !imageUrl) {
      toast.error("Instagram posts require an image URL");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/social-media/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: scheduleLater ? "schedule_post" : "post_now",
          platform: selectedPlatform,
          content: customContent,
          imageUrl,
          scheduledDate: scheduleLater ? new Date(Date.now() + 3600000).toISOString() : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(scheduleLater ? "Post scheduled successfully!" : "Posted successfully!");
        setCustomContent("");
        setImageUrl("");
      } else {
        toast.error(data.error || "Failed to post");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to post to social media");
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Social Media Automation</h1>
        <p className="text-muted-foreground">
          Manage and automate your social media presence across all platforms
        </p>
      </div>

      <Tabs defaultValue="post" className="space-y-6">
        <TabsList>
          <TabsTrigger value="post">Create Post</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create & Schedule Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="portfolio">Portfolio Showcase</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI Content Generator */}
              <div className="space-y-2">
                <Button
                  onClick={generateAIContent}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Content
                </Button>
              </div>

              {/* Content Input */}
              <div className="space-y-2">
                <Label>Post Content</Label>
                <Textarea
                  placeholder="Write or generate your post content..."
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  rows={8}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label>Image URL {selectedPlatform === "instagram" && "(Required)"}</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => postToSocialMedia(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Post Now
                </Button>
                <Button
                  onClick={() => postToSocialMedia(true)}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Content Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              {calendar.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Loading content calendar...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {calendar.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(item.platform)}
                            <span className="font-medium capitalize">{item.platform}</span>
                            <Badge variant={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.suggestedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.hashtags.map((tag, i) => (
                            <Badge key={i} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm italic text-muted-foreground">
                          CTA: {item.callToAction}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Analytics will be available once Facebook Business Manager is connected</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
