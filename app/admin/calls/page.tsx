
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Clock, DollarSign, TrendingUp, Play, Download } from 'lucide-react';

interface CallLog {
  id: string;
  name: string;
  phone: string;
  businessName: string;
  projectType: string;
  budget: string;
  timeline: string;
  score: number;
  status: 'hot' | 'warm' | 'cold';
  duration: number;
  transcript: string;
  createdAt: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [stats, setStats] = useState({
    totalCalls: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    avgDuration: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await fetch('/api/admin/calls');
      const data = await response.json();
      setCalls(data.calls || []);
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-orange-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot': return '🔥';
      case 'warm': return '💼';
      case 'cold': return '❄️';
      default: return '📞';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Call Logs - Sora AI</h1>
        <p className="text-muted-foreground mt-2">
          Monitor all incoming calls handled by your AI receptionist
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.hotLeads}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to buy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(stats.avgDuration)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per call
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Calls → Hot Leads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>
            Calls handled by Sora in the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading calls...
            </div>
          ) : calls.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No calls yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Calls will appear here once Sora starts taking calls
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getStatusIcon(call.status)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{call.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {call.businessName}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{call.phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Project</p>
                          <p className="font-medium">{call.projectType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Budget</p>
                          <p className="font-medium">{call.budget}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeline</p>
                          <p className="font-medium">{call.timeline}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Badge className={getStatusColor(call.status)}>
                          {call.status.toUpperCase()} - Score: {call.score}/100
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(call.duration)} • {new Date(call.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Listen
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Transcript
                      </Button>
                    </div>
                  </div>

                  {/* Transcript Preview */}
                  {call.transcript && (
                    <details className="mt-4">
                      <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                        View Transcript
                      </summary>
                      <div className="mt-2 p-3 bg-muted rounded text-sm whitespace-pre-wrap">
                        {call.transcript.substring(0, 500)}
                        {call.transcript.length > 500 && '...'}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
