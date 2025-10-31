
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  TrendingUp,
  RefreshCw,
  Zap,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Target,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type IntentLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  phoneType: string | null;
  phoneValid: boolean;
  businessName: string | null;
  businessType: string | null;
  currentWebsite: string | null;
  projectType: string;
  projectDescription: string | null;
  features: string[];
  budgetRange: string;
  budgetAmount: number | null;
  timeline: string;
  urgencyScore: number;
  leadScore: number;
  qualificationStatus: string;
  disqualifyReason: string | null;
  firstContactedAt: string | null;
  createdAt: string;
};

type Stats = {
  total: number;
  qualified: number;
  pending: number;
  contacted: number;
  converted: number;
  averageScore: number;
  averageBudget: number;
};

export default function IntentLeadsPage() {
  const [leads, setLeads] = useState<IntentLead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    qualified: 0,
    pending: 0,
    contacted: 0,
    converted: 0,
    averageScore: 0,
    averageBudget: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/intent-leads");
      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || stats);
    } catch (error) {
      console.error("Error fetching intent leads:", error);
      toast.error("Failed to load intent leads");
    } finally {
      setLoading(false);
    }
  };

  const markAsContacted = async (leadId: string) => {
    try {
      const response = await fetch(`/api/intent-leads/${leadId}/contact`, {
        method: "POST"
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Lead marked as contacted!");
        fetchLeads();
      } else {
        toast.error("Failed to update lead");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || 
      lead.qualificationStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getQualificationColor = (status: string) => {
    switch (status) {
      case "QUALIFIED": return "bg-green-500";
      case "PENDING": return "bg-yellow-500";
      case "DISQUALIFIED": return "bg-red-500";
      case "CONTACTED": return "bg-blue-500";
      case "CONVERTED": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const formatBudget = (range: string) => {
    return `$${range.replace('-', ' - ')}`;
  };

  const formatTimeline = (timeline: string) => {
    return timeline.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading intent leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Intent-Based Leads</h1>
            <p className="text-gray-400">High-intent prospects from your landing pages</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-gray-700 text-gray-300">
              View Scraped Leads
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">From landing pages</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Qualified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.qualified}</div>
              <p className="text-xs text-gray-500 mt-1">Ready to contact</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.averageScore}</div>
              <p className="text-xs text-gray-500 mt-1">Lead quality</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">${stats.averageBudget.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Expected value</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/20 rounded-full p-3">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Landing Page Live!</h3>
              <p className="text-gray-400 mb-4">
                Your landing page is live at <span className="text-blue-400 font-mono">/get-quote</span>. 
                Start driving traffic with Google Ads to capture high-intent leads automatically!
              </p>
              <div className="flex gap-3">
                <Link href="/get-quote" target="_blank">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Preview Landing Page
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
                <SelectItem value="DISQUALIFIED">Disqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leads Grid */}
        {filteredLeads.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12 text-center">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No leads yet</h3>
              <p className="text-gray-400 mb-6">
                Start driving traffic to your landing page to capture intent-based leads!
              </p>
              <Link href="/get-quote" target="_blank">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Preview Landing Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Contact & Business Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{lead.fullName}</h3>
                          {lead.businessName && (
                            <p className="text-gray-400">{lead.businessName}</p>
                          )}
                        </div>
                        <Badge className={getQualificationColor(lead.qualificationStatus)}>
                          {lead.qualificationStatus}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{lead.phone}</span>
                          {lead.phoneType && (
                            <Badge variant="outline" className="text-xs">
                              {lead.phoneType}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.currentWebsite && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Globe className="w-4 h-4" />
                            <a 
                              href={lead.currentWebsite} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-400 transition-colors"
                            >
                              {lead.currentWebsite}
                            </a>
                          </div>
                        )}
                      </div>

                      {lead.projectDescription && (
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {lead.projectDescription}
                        </p>
                      )}

                      {lead.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {lead.features.slice(0, 5).map(feature => (
                            <Badge 
                              key={feature} 
                              variant="outline" 
                              className="text-xs text-gray-400 border-gray-700"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {lead.features.length > 5 && (
                            <Badge variant="outline" className="text-xs text-gray-400 border-gray-700">
                              +{lead.features.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Project Details & Score */}
                    <div className="lg:w-80 space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-400 text-sm">Lead Score</span>
                          <span className={`text-2xl font-bold ${getScoreColor(lead.leadScore)}`}>
                            {lead.leadScore}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Project:</span>
                            <span className="text-white font-medium">
                              {lead.projectType.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Budget:</span>
                            <span className="text-green-400 font-medium">
                              {formatBudget(lead.budgetRange)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Timeline:</span>
                            <span className="text-blue-400 font-medium">
                              {formatTimeline(lead.timeline)}
                            </span>
                          </div>
                          {lead.businessType && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Industry:</span>
                              <span className="text-white">{lead.businessType}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!lead.firstContactedAt ? (
                          <>
                            <Button
                              onClick={() => window.open(`tel:${lead.phone}`)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </Button>
                            <Button
                              onClick={() => markAsContacted(lead.id)}
                              variant="outline"
                              className="flex-1 border-gray-700 text-gray-300"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Contacted
                            </Button>
                          </>
                        ) : (
                          <Badge variant="outline" className="w-full justify-center py-2 text-gray-400 border-gray-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Already Contacted
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 text-center">
                        Submitted {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {lead.disqualifyReason && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-2 text-sm text-yellow-500">
                        <XCircle className="w-4 h-4" />
                        <span>{lead.disqualifyReason}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
