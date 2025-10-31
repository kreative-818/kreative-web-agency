
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Clock, User, PhoneCall, PhoneIncoming, PhoneOutgoing, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CallLog = {
  id: number;
  callId: string;
  fromNumber: string;
  toNumber: string;
  direction: string;
  status: string;
  duration: number;
  recordingUrl: string | null;
  transcription: string | null;
  summary: string | null;
  customerType: string | null;
  isExistingCustomer: boolean;
  transferredToHuman: boolean;
  createdAt: string;
};

export default function CallLogsPage() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCalls: 0,
    completedCalls: 0,
    missedCalls: 0,
    transferred: 0,
    avgDuration: 0,
  });

  useEffect(() => {
    fetchCallLogs();
    const interval = setInterval(fetchCallLogs, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchCallLogs = async () => {
    try {
      const response = await fetch("/api/call-logs");
      if (response.ok) {
        const data = await response.json();
        setCallLogs(data.callLogs || []);
        calculateStats(data.callLogs || []);
      }
    } catch (error) {
      console.error("Error fetching call logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logs: CallLog[]) => {
    const totalCalls = logs.length;
    const completedCalls = logs.filter((log) => log.status === "completed").length;
    const missedCalls = logs.filter((log) => log.status === "missed").length;
    const transferred = logs.filter((log) => log.transferredToHuman).length;
    const avgDuration =
      logs.reduce((acc, log) => acc + (log.duration || 0), 0) / (totalCalls || 1);

    setStats({
      totalCalls,
      completedCalls,
      missedCalls,
      transferred,
      avgDuration: Math.round(avgDuration),
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") return <Badge className="bg-green-600">Completed</Badge>;
    if (status === "missed") return <Badge variant="destructive">Missed</Badge>;
    if (status === "voicemail") return <Badge className="bg-yellow-600">Voicemail</Badge>;
    if (status === "transferred") return <Badge className="bg-blue-600">Transferred</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const getDirectionIcon = (direction: string) => {
    if (direction === "inbound") return <PhoneIncoming className="h-4 w-4 text-green-600" />;
    if (direction === "outbound") return <PhoneOutgoing className="h-4 w-4 text-blue-600" />;
    return <Phone className="h-4 w-4" />;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Call Logs</h1>
        <p className="text-muted-foreground">
          View and manage all phone calls from Sona AI (Quo.ai)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <PhoneCall className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.missedCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferred</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.transferred}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Call Logs Table */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>All phone calls from Sona AI system</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : callLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No call logs yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Direction</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {callLogs.map((call) => (
                        <TableRow
                          key={call.id}
                          onClick={() => setSelectedCall(call)}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <TableCell>{getDirectionIcon(call.direction)}</TableCell>
                          <TableCell className="font-medium">{call.fromNumber}</TableCell>
                          <TableCell>{getStatusBadge(call.status)}</TableCell>
                          <TableCell>{formatDuration(call.duration)}</TableCell>
                          <TableCell>
                            {call.isExistingCustomer ? (
                              <Badge variant="secondary">Existing</Badge>
                            ) : (
                              <Badge variant="outline">New</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(call.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Call Details */}
        <div className="md:col-span-1">
          {selectedCall ? (
            <Card>
              <CardHeader>
                <CardTitle>Call Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                    {getStatusBadge(selectedCall.status)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">From</div>
                    <div className="flex items-center gap-2">
                      {getDirectionIcon(selectedCall.direction)}
                      <span>{selectedCall.fromNumber}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">To</div>
                    <div>{selectedCall.toNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Duration</div>
                    <div>{formatDuration(selectedCall.duration)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Customer Type
                    </div>
                    {selectedCall.isExistingCustomer ? (
                      <Badge variant="secondary">Existing Customer</Badge>
                    ) : (
                      <Badge variant="outline">New Customer</Badge>
                    )}
                  </div>
                  {selectedCall.transferredToHuman && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Transferred
                      </div>
                      <Badge className="bg-blue-600">Transferred to Human</Badge>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Date & Time</div>
                    <div>{new Date(selectedCall.createdAt).toLocaleString()}</div>
                  </div>
                  {selectedCall.summary && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Summary</div>
                      <div className="text-sm p-3 bg-muted rounded-lg">
                        {selectedCall.summary}
                      </div>
                    </div>
                  )}
                  {selectedCall.recordingUrl && (
                    <div>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={selectedCall.recordingUrl} target="_blank" rel="noopener noreferrer">
                          Listen to Recording
                        </a>
                      </Button>
                    </div>
                  )}
                  {selectedCall.transcription && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Transcription
                      </div>
                      <ScrollArea className="h-[200px] p-3 bg-muted rounded-lg">
                        <div className="text-sm whitespace-pre-wrap">
                          {selectedCall.transcription}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center text-muted-foreground">
                  <Phone className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a call to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
