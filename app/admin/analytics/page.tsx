
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SourceStats {
  source: string;
  total: number;
  avgScore: number;
  converted: number;
  contacted: number;
  interested: number;
  conversionRate: string;
}

interface PlatformStats {
  google: number;
  linkedin: number;
  facebook: number;
  instagram: number;
  tiktok: number;
}

interface Summary {
  totalLeads: number;
  avgScore: number;
  totalConverted: number;
  totalContacted: number;
}

interface RecentLead {
  id: string;
  businessName: string;
  primarySource: string;
  leadScore: number;
  leadCategory: string;
  discoveredAt: string;
}

interface AnalyticsData {
  sourceStats: SourceStats[];
  platformStats: PlatformStats;
  summary: Summary;
  recentLeads: RecentLead[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/sources');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-400">Failed to load analytics</div>
        </div>
      </div>
    );
  }

  const pieData = data.sourceStats.map((stat) => ({
    name: stat.source,
    value: stat.total,
  }));

  const barData = data.sourceStats.map((stat) => ({
    source: stat.source,
    total: stat.total,
    converted: stat.converted,
    contacted: stat.contacted,
  }));

  const platformData = [
    { name: 'Google', value: data.platformStats.google },
    { name: 'LinkedIn', value: data.platformStats.linkedin },
    { name: 'Facebook', value: data.platformStats.facebook },
    { name: 'Instagram', value: data.platformStats.instagram },
    { name: 'TikTok', value: data.platformStats.tiktok },
  ].filter((p) => p.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lead Source Analytics</h1>
          <p className="text-gray-400">Track where your leads are coming from and their quality</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Leads</CardTitle>
              <Users className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{data.summary.totalLeads}</div>
              <p className="text-xs text-gray-500 mt-1">All sources combined</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Lead Score</CardTitle>
              <Target className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{data.summary.avgScore}</div>
              <p className="text-xs text-gray-500 mt-1">Quality indicator</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Contacted</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{data.summary.totalContacted}</div>
              <p className="text-xs text-gray-500 mt-1">Outreach initiated</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Converted</CardTitle>
              <DollarSign className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{data.summary.totalConverted}</div>
              <p className="text-xs text-gray-500 mt-1">
                {data.summary.totalLeads > 0
                  ? `${((data.summary.totalConverted / data.summary.totalLeads) * 100).toFixed(1)}% conversion rate`
                  : 'No conversions yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Leads by Source - Pie Chart */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Leads by Source</CardTitle>
              <CardDescription className="text-gray-400">Distribution across channels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance by Source - Bar Chart */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Performance by Source</CardTitle>
              <CardDescription className="text-gray-400">Contacted vs Converted</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="source" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total" />
                  <Bar dataKey="contacted" fill="#10b981" name="Contacted" />
                  <Bar dataKey="converted" fill="#f59e0b" name="Converted" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Source Details Table */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Detailed Source Metrics</CardTitle>
            <CardDescription className="text-gray-400">Performance breakdown by marketing channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Source</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Total Leads</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Avg Score</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Contacted</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Interested</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Converted</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sourceStats.map((stat, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <Badge variant={stat.source === 'SEO' ? 'default' : 'outline'} className="text-white">
                          {stat.source}
                        </Badge>
                      </td>
                      <td className="text-right text-white font-medium py-3 px-4">{stat.total}</td>
                      <td className="text-right text-white py-3 px-4">
                        <span className={
                          stat.avgScore >= 70 ? 'text-green-400' :
                          stat.avgScore >= 50 ? 'text-yellow-400' :
                          'text-red-400'
                        }>
                          {stat.avgScore}
                        </span>
                      </td>
                      <td className="text-right text-white py-3 px-4">{stat.contacted}</td>
                      <td className="text-right text-white py-3 px-4">{stat.interested}</td>
                      <td className="text-right text-white py-3 px-4">{stat.converted}</td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-white font-medium">{stat.conversionRate}%</span>
                          {parseFloat(stat.conversionRate) > 5 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Leads</CardTitle>
            <CardDescription className="text-gray-400">Latest leads across all sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-white font-medium">{lead.businessName}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(lead.discoveredAt).toLocaleDateString()} via {lead.primarySource}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={lead.leadCategory === 'HOT' ? 'default' : 'outline'}
                      className={
                        lead.leadCategory === 'HOT' ? 'bg-red-500' :
                        lead.leadCategory === 'WARM' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }
                    >
                      {lead.leadCategory}
                    </Badge>
                    <div className="text-right">
                      <div className="text-white font-bold">{lead.leadScore}</div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
