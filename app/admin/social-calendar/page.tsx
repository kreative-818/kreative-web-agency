
"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Share2, Sparkles, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ScheduledPost {
  date: string;
  platform: string;
  contentType: string;
  content: string;
  status: string;
}

export default function SocialCalendarPage() {
  const [calendar, setCalendar] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateCalendar = async (days: number = 30) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/social-media/generate-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });

      const data = await response.json();

      if (data.success) {
        setCalendar(data.calendar);
        toast.success(data.message);
      } else {
        toast.error("Failed to generate calendar");
      }
    } catch (error) {
      console.error("Calendar generation error:", error);
      toast.error("Failed to generate calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ["Date", "Platform", "Content Type", "Content"],
      ...calendar.map((post) => [
        new Date(post.date).toLocaleDateString(),
        post.platform,
        post.contentType,
        `"${post.content.replace(/"/g, '""')}"`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `social-media-calendar-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    toast.success("Calendar exported to CSV");
  };

  const getPlatformColor = (platform: string) => {
    const colors: any = {
      facebook: "bg-blue-100 text-blue-800",
      instagram: "bg-pink-100 text-pink-800",
      linkedin: "bg-indigo-100 text-indigo-800",
      twitter: "bg-sky-100 text-sky-800",
    };
    return colors[platform] || "bg-gray-100 text-gray-800";
  };

  const groupByWeek = () => {
    const weeks: { [key: string]: ScheduledPost[] } = {};

    calendar.forEach((post) => {
      const date = new Date(post.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(post);
    });

    return weeks;
  };

  const weeks = groupByWeek();

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Social Media Calendar</h1>
            <p className="text-gray-400">
              AI-generated content calendar for all your social platforms
            </p>
          </div>
          <div className="flex gap-2">
            {calendar.length > 0 && (
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
            <Button
              onClick={() => generateCalendar(30)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Calendar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        {calendar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Posts</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{calendar.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Facebook</CardTitle>
                <Share2 className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {calendar.filter((p) => p.platform === "facebook").length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Instagram</CardTitle>
                <Share2 className="h-4 w-4 text-pink-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {calendar.filter((p) => p.platform === "instagram").length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">LinkedIn</CardTitle>
                <Share2 className="h-4 w-4 text-indigo-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {calendar.filter((p) => p.platform === "linkedin").length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Calendar View */}
        {calendar.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <Calendar className="h-16 w-16 mx-auto text-gray-600" />
                <h3 className="text-xl font-semibold text-white">
                  No Content Calendar Yet
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Generate an AI-powered content calendar for your social media platforms.
                  We'll create engaging posts for the next 30 days.
                </p>
                <Button
                  onClick={() => generateCalendar(30)}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Your First Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(weeks)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([weekStart, posts]) => (
                <Card key={weekStart} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Week of {new Date(weekStart).toLocaleDateString()}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {posts.length} posts scheduled
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {posts
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() - new Date(b.date).getTime()
                      )
                      .map((post, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-medium text-gray-400">
                                {new Date(post.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              <Badge className={getPlatformColor(post.platform)}>
                                {post.platform}
                              </Badge>
                              <Badge variant="outline" className="border-gray-600 text-gray-300">
                                {post.contentType}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">
                            {post.content}
                          </p>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

