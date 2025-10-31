
"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  TrendingUp,
  RefreshCw,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Play
} from "lucide-react";
import { toast } from "sonner";

type ScrapedLead = {
  id: string;
  businessName: string;
  industry: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  leadScore: number;
  leadCategory: string | null;
  status: string;
  hasWebsite: boolean;
  websiteScore: number | null;
  googleRating: number | null;
  googleReviewsCount: number | null;
  foundOnGoogle: boolean;
  foundOnLinkedin: boolean;
  foundOnFacebook: boolean;
  foundOnInstagram: boolean;
  foundOnTiktok: boolean;
  contactAttempts: number;
  responseReceived: boolean;
  interestedInService: boolean;
  discoveredAt: string;
  lastContactedAt: string | null;
};

type Stats = {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  contacted: number;
  interested: number;
  converted: number;
};

export default function AdminDashboard() {
  const [leads, setLeads] = useState<ScrapedLead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    contacted: 0,
    interested: 0,
    converted: 0
  });
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/scraped-leads");
      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || stats);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const startGoogleScraping = async () => {
    try {
      setScraping(true);
      toast.info("Starting Google Business scraping...");
      
      const response = await fetch("/api/scrape/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "Raleigh, NC",
          industries: ["contractor", "real_estate_agency", "plumber", "electrician", "restaurant"]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Found ${data.leadsFound} new leads!`);
        fetchLeads();
      } else {
        toast.error(data.error || "Scraping failed");
      }
    } catch (error) {
      console.error("Scraping error:", error);
      toast.error("Failed to start scraping");
    } finally {
      setScraping(false);
    }
  };

  const analyzeLead = async (leadId: string) => {
    try {
      toast.info("Analyzing lead...");
      
      const response = await fetch("/api/analyze-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Lead analyzed successfully!");
        fetchLeads();
      } else {
        toast.error(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze lead");
    }
  };

  const startOutreach = async (leadId: string) => {
    try {
      toast.info("Starting outreach campaign...");
      
      const response = await fetch("/api/outreach/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Outreach campaign started!");
        fetchLeads();
      } else {
        toast.error(data.error || "Outreach failed");
      }
    } catch (error) {
      console.error("Outreach error:", error);
      toast.error("Failed to start outreach");
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || lead.leadCategory === filterCategory;
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getLeadCategoryColor = (category: string | null) => {
    switch (category) {
      case "HOT": return "bg-red-500";
      case "WARM": return "bg-orange-500";
      case "COLD": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-purple-500";
      case "CONTACTED": return "bg-blue-500";
      case "INTERESTED": return "bg-green-500";
      case "QUALIFIED": return "bg-emerald-500";
      case "CONVERTED": return "bg-yellow-500";
      case "LOST": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Monitor your lead generation and business metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">All discovered leads</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Hot Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{stats.hot}</div>
              <p className="text-xs text-gray-500 mt-1">Score 80+</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Contacted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.contacted}</div>
              <p className="text-xs text-gray-500 mt-1">Outreach sent</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Interested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.interested}</div>
              <p className="text-xs text-gray-500 mt-1">Positive responses</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              onClick={startGoogleScraping}
              disabled={scraping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {scraping ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Google Scraping
                </>
              )}
            </Button>

            <Button 
              onClick={() => window.location.href = '/admin/intent-leads'}
              variant="outline" 
              className="border-gray-700 text-gray-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              View Intent Leads
            </Button>

            <Button variant="outline" className="border-gray-700 text-gray-300">
              <Target className="w-4 h-4 mr-2" />
              Start Bulk Outreach
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="HOT">Hot</SelectItem>
                <SelectItem value="WARM">Warm</SelectItem>
                <SelectItem value="COLD">Cold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="INTERESTED">Interested</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Platforms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No leads found. Start scraping to discover new leads!
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{lead.businessName}</div>
                          <div className="text-sm text-gray-500">
                            {lead.industry} • {lead.city}, {lead.state}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getLeadCategoryColor(lead.leadCategory)}>
                            {lead.leadCategory || "N/A"}
                          </Badge>
                          <span className="text-white font-medium">{lead.leadScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </div>
                          )}
                          {lead.email && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {lead.foundOnGoogle && <Badge variant="outline" className="text-xs">Google</Badge>}
                          {lead.foundOnLinkedin && <Badge variant="outline" className="text-xs">LinkedIn</Badge>}
                          {lead.foundOnFacebook && <Badge variant="outline" className="text-xs">Facebook</Badge>}
                          {lead.foundOnInstagram && <Badge variant="outline" className="text-xs">Instagram</Badge>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => analyzeLead(lead.id)}
                            className="text-xs"
                          >
                            Analyze
                          </Button>
                          {lead.status === "NEW" && (
                            <Button 
                              size="sm" 
                              onClick={() => startOutreach(lead.id)}
                              className="text-xs bg-blue-600 hover:bg-blue-700"
                            >
                              Start Outreach
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
