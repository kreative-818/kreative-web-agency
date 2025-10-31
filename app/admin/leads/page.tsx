
"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Clock, Star, Filter, Search } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  businessName: string | null;
  projectType: string | null;
  budget: string | null;
  timeline: string | null;
  source: string;
  score: number;
  status: string;
  notes: string | null;
  metadata: any;
  createdAt: string;
}

interface CallLog {
  id: number;
  duration: number;
  transcript: string;
  recording: string;
  createdAt: string;
}

interface FollowUp {
  id: number;
  sequence: number;
  channel: string;
  status: string;
  scheduledFor: string;
  sentAt: string | null;
  subject: string | null;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/admin/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone?.includes(searchTerm) ||
          lead.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
    }

    // Sort by score (highest first) and then by date (newest first)
    filtered.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredLeads(filtered);
  };

  const openLeadDetails = async (lead: Lead) => {
    setSelectedLead(lead);
    setNotes(lead.notes || "");

    // Fetch call logs and follow-ups
    try {
      const [callLogsRes, followUpsRes] = await Promise.all([
        fetch(`/api/admin/leads/${lead.id}/call-logs`),
        fetch(`/api/admin/leads/${lead.id}/follow-ups`),
      ]);

      if (callLogsRes.ok) {
        const callLogsData = await callLogsRes.json();
        setCallLogs(callLogsData.callLogs);
      }

      if (followUpsRes.ok) {
        const followUpsData = await followUpsRes.json();
        setFollowUps(followUpsData.followUps);
      }
    } catch (error) {
      console.error("Error fetching lead details:", error);
    }
  };

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Lead status updated");
        fetchLeads();
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const saveNotes = async () => {
    if (!selectedLead) return;

    try {
      const response = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        toast.success("Notes saved");
        fetchLeads();
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      contacted: "secondary",
      qualified: "outline",
      "proposal-sent": "outline",
      won: "outline",
      lost: "destructive",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  const getUrgencyBadge = (score: number) => {
    if (score >= 8) {
      return (
        <Badge className="bg-red-500 text-white">
          🔥 HOT ({score}/10)
        </Badge>
      );
    } else if (score >= 6) {
      return (
        <Badge className="bg-orange-500 text-white">
          ⚡ WARM ({score}/10)
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          ❄️ COLD ({score}/10)
        </Badge>
      );
    }
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      "quo-call": "bg-blue-500",
      form: "bg-green-500",
      chat: "bg-purple-500",
      manual: "bg-gray-500",
    };

    return (
      <Badge className={`${colors[source] || "bg-gray-500"} text-white`}>
        {source.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Lead Management</h1>
            <p className="text-gray-400 mt-1">
              Track and manage all your leads from Quo calls, forms, and chat
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <div className="text-sm text-gray-400">Total Leads</div>
              <div className="text-3xl font-bold text-white mt-1">{leads.length}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <div className="text-sm text-gray-400">New Leads</div>
              <div className="text-3xl font-bold text-white mt-1">
                {leads.filter((l) => l.status === "new").length}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <div className="text-sm text-gray-400">Hot Leads (8+)</div>
              <div className="text-3xl font-bold mt-1 text-red-500">
                {leads.filter((l) => l.score >= 8).length}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <div className="text-sm text-gray-400">Conversion Rate</div>
              <div className="text-3xl font-bold mt-1 text-green-500">
                {leads.length > 0
                  ? Math.round(
                      (leads.filter((l) => l.status === "won").length / leads.length) * 100
                    )
                  : 0}
                %
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal-sent">Proposal Sent</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="quo-call">Quo Call</SelectItem>
                  <SelectItem value="form">Form</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Lead Info</TableHead>
                  <TableHead className="text-gray-400">Contact</TableHead>
                  <TableHead className="text-gray-400">Project</TableHead>
                  <TableHead className="text-gray-400">Budget</TableHead>
                  <TableHead className="text-gray-400">Timeline</TableHead>
                  <TableHead className="text-gray-400">Urgency</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Source</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow className="border-gray-800">
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-gray-800/50 border-gray-800"
                      onClick={() => openLeadDetails(lead)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{lead.name}</div>
                          {lead.businessName && (
                            <div className="text-sm text-gray-500">{lead.businessName}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {lead.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{lead.projectType || "-"}</TableCell>
                      <TableCell className="text-gray-300">{lead.budget || "-"}</TableCell>
                      <TableCell className="text-gray-300">{lead.timeline || "-"}</TableCell>
                      <TableCell>{getUrgencyBadge(lead.score)}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{getSourceBadge(lead.source)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLeadDetails(lead);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">
                  {selectedLead.name}
                  {selectedLead.score >= 8 && (
                    <span className="ml-2 text-red-500">🔥 HOT LEAD</span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Lead #{selectedLead.id} • Created{" "}
                  {new Date(selectedLead.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="font-medium text-white">
                        {selectedLead.email || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Phone</div>
                      <div className="font-medium text-white">
                        {selectedLead.phone || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Business Name</div>
                      <div className="font-medium text-white">
                        {selectedLead.businessName || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Source</div>
                      <div>{getSourceBadge(selectedLead.source)}</div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Project Type</div>
                      <div className="font-medium text-white">
                        {selectedLead.projectType || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Budget</div>
                      <div className="font-medium text-white">
                        {selectedLead.budget || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Timeline</div>
                      <div className="font-medium text-white">
                        {selectedLead.timeline || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Urgency Score</div>
                      <div>{getUrgencyBadge(selectedLead.score)}</div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Lead Status</h3>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal-sent">Proposal Sent</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Call Logs */}
                {callLogs.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-white">Call History</h3>
                    <div className="space-y-3">
                      {callLogs.map((call) => (
                        <div
                          key={call.id}
                          className="border border-gray-800 bg-gray-800/50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-400">
                                {Math.floor(call.duration / 60)}m {call.duration % 60}s
                              </span>
                              <Clock className="h-4 w-4 text-gray-400 ml-2" />
                              <span className="text-sm text-gray-400">
                                {new Date(call.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {call.recording && (
                              <Button size="sm" variant="outline" className="border-gray-700 text-gray-300" asChild>
                                <a href={call.recording} target="_blank" rel="noopener noreferrer">
                                  Listen
                                </a>
                              </Button>
                            )}
                          </div>
                          {call.transcript && (
                            <div className="text-sm text-gray-300 mt-2">
                              {call.transcript.substring(0, 200)}
                              {call.transcript.length > 200 && "..."}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-ups */}
                {followUps.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-white">Follow-up Sequence</h3>
                    <div className="space-y-2">
                      {followUps.map((followUp) => (
                        <div
                          key={followUp.id}
                          className="flex items-center justify-between border border-gray-800 bg-gray-800/50 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">
                              {followUp.channel === "email" ? "📧" : "📱"} Touch #{followUp.sequence}
                            </Badge>
                            {followUp.subject && (
                              <span className="text-sm text-gray-300">{followUp.subject}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              {followUp.sentAt
                                ? `Sent ${new Date(followUp.sentAt).toLocaleDateString()}`
                                : `Scheduled ${new Date(followUp.scheduledFor).toLocaleDateString()}`}
                            </span>
                            <Badge
                              variant={
                                followUp.status === "sent"
                                  ? "default"
                                  : followUp.status === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {followUp.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h3 className="font-semibold mb-3 text-white">Notes</h3>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this lead..."
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button onClick={saveNotes} className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Save Notes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
