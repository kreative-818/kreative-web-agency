
'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, TrendingUp, Target, Plus, Edit, Trash2, DollarSign, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SEOKeyword {
  id: string;
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
  intent?: string;
  currentRanking?: number;
  targetRanking: number;
  pages: string[];
  isPrimary: boolean;
  isActive: boolean;
  clicks: number;
  impressions: number;
  ctr?: number;
}

export default function SEOPage() {
  const [keywords, setKeywords] = useState<SEOKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    searchVolume: '',
    difficulty: '',
    cpc: '',
    intent: 'COMMERCIAL',
    isPrimary: false,
    pages: '',
  });

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/keywords');
      const data = await response.json();
      setKeywords(data.keywords || []);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch SEO keywords',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async () => {
    if (!newKeyword.keyword) {
      toast({
        title: 'Error',
        description: 'Keyword is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: newKeyword.keyword,
          searchVolume: newKeyword.searchVolume ? parseInt(newKeyword.searchVolume) : null,
          difficulty: newKeyword.difficulty ? parseInt(newKeyword.difficulty) : null,
          cpc: newKeyword.cpc ? parseFloat(newKeyword.cpc) : null,
          intent: newKeyword.intent,
          isPrimary: newKeyword.isPrimary,
          pages: newKeyword.pages ? newKeyword.pages.split(',').map(p => p.trim()) : [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Keyword added successfully',
        });
        setIsAddDialogOpen(false);
        setNewKeyword({
          keyword: '',
          searchVolume: '',
          difficulty: '',
          cpc: '',
          intent: 'COMMERCIAL',
          isPrimary: false,
          pages: '',
        });
        fetchKeywords();
      }
    } catch (error) {
      console.error('Error adding keyword:', error);
      toast({
        title: 'Error',
        description: 'Failed to add keyword',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    if (!confirm('Are you sure you want to delete this keyword?')) return;

    try {
      const response = await fetch(`/api/seo/keywords?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Keyword deleted successfully',
        });
        fetchKeywords();
      }
    } catch (error) {
      console.error('Error deleting keyword:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete keyword',
        variant: 'destructive',
      });
    }
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'bg-gray-500';
    if (difficulty < 30) return 'bg-green-500';
    if (difficulty < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRankingColor = (ranking?: number) => {
    if (!ranking) return 'bg-gray-500';
    if (ranking <= 3) return 'bg-green-500';
    if (ranking <= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const primaryKeywords = keywords.filter(k => k.isPrimary);
  const secondaryKeywords = keywords.filter(k => !k.isPrimary);
  const avgSearchVolume = keywords.reduce((acc, k) => acc + (k.searchVolume || 0), 0) / keywords.length;
  const totalImpressions = keywords.reduce((acc, k) => acc + k.impressions, 0);

  return (
    <AdminLayout>
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SEO Keywords</h1>
          <p className="text-muted-foreground">Track and manage your SEO keyword strategy</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Keyword
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add SEO Keyword</DialogTitle>
              <DialogDescription>
                Track a new keyword for your SEO strategy
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="e.g., web design services"
                  value={newKeyword.keyword}
                  onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="searchVolume">Monthly Search Volume</Label>
                  <Input
                    id="searchVolume"
                    type="number"
                    placeholder="e.g., 2000"
                    value={newKeyword.searchVolume}
                    onChange={(e) => setNewKeyword({ ...newKeyword, searchVolume: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty (0-100)</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    placeholder="e.g., 45"
                    value={newKeyword.difficulty}
                    onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpc">CPC ($)</Label>
                  <Input
                    id="cpc"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 5.50"
                    value={newKeyword.cpc}
                    onChange={(e) => setNewKeyword({ ...newKeyword, cpc: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="intent">Search Intent</Label>
                  <Select
                    value={newKeyword.intent}
                    onValueChange={(value) => setNewKeyword({ ...newKeyword, intent: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                      <SelectItem value="INFORMATIONAL">Informational</SelectItem>
                      <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="pages">Target Pages (comma-separated)</Label>
                <Input
                  id="pages"
                  placeholder="e.g., /services, /portfolio"
                  value={newKeyword.pages}
                  onChange={(e) => setNewKeyword({ ...newKeyword, pages: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={newKeyword.isPrimary}
                  onChange={(e) => setNewKeyword({ ...newKeyword, isPrimary: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isPrimary">Primary Keyword</Label>
              </div>

              <Button onClick={handleAddKeyword} className="w-full">
                Add Keyword
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.length}</div>
            <p className="text-xs text-muted-foreground">
              {primaryKeywords.length} primary
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Search Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgSearchVolume).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Traffic Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(keywords.reduce((acc, k) => acc + (k.cpc || 0) * k.clicks, 0)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">from clicks</p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Keywords</CardTitle>
          <CardDescription>Your main target keywords for ranking</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading keywords...</div>
          ) : primaryKeywords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No primary keywords found. Add your first keyword to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {primaryKeywords.map((keyword) => (
                <div key={keyword.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{keyword.keyword}</h4>
                      <Badge variant="default">Primary</Badge>
                      {keyword.intent && (
                        <Badge variant="outline">{keyword.intent}</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {keyword.searchVolume && (
                        <span>📊 {keyword.searchVolume.toLocaleString()}/mo</span>
                      )}
                      {keyword.difficulty !== undefined && (
                        <Badge className={getDifficultyColor(keyword.difficulty)}>
                          Difficulty: {keyword.difficulty}
                        </Badge>
                      )}
                      {keyword.cpc && (
                        <span>💰 ${keyword.cpc.toFixed(2)} CPC</span>
                      )}
                      {keyword.currentRanking && (
                        <Badge className={getRankingColor(keyword.currentRanking)}>
                          #{keyword.currentRanking}
                        </Badge>
                      )}
                    </div>

                    {keyword.pages.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Pages: {keyword.pages.join(', ')}
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteKeyword(keyword.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secondary Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Secondary Keywords</CardTitle>
          <CardDescription>Supporting keywords for comprehensive coverage</CardDescription>
        </CardHeader>
        <CardContent>
          {secondaryKeywords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No secondary keywords found.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {secondaryKeywords.map((keyword) => (
                <div key={keyword.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{keyword.keyword}</h5>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {keyword.searchVolume && (
                        <span>{keyword.searchVolume.toLocaleString()}/mo</span>
                      )}
                      {keyword.difficulty !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          Diff: {keyword.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteKeyword(keyword.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
}
