
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Plus, Eye, Loader2, Briefcase } from 'lucide-react';

interface Client {
  id: number;
  fullName: string;
  businessName?: string;
}

interface Project {
  id: number;
  clientId: number;
  title: string;
  description?: string;
  projectType: string;
  status: string;
  progress: number;
  startDate?: string;
  estimatedCompletionDate?: string;
  budget?: number;
  createdAt: string;
  client?: Client;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    projectType: 'website',
    status: 'not_started',
    startDate: '',
    estimatedCompletionDate: '',
    budget: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load clients
      const clientsResponse = await fetch('/api/admin/clients');
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        setClients(clientsData.clients || []);
      }

      // Load projects
      const projectsResponse = await fetch('/api/admin/projects');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        clientId: parseInt(formData.clientId),
        budget: formData.budget ? parseFloat(formData.budget) * 100 : null, // Convert to cents
      };

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Project created successfully!');
        setOpen(false);
        setFormData({
          clientId: '',
          title: '',
          description: '',
          projectType: 'website',
          status: 'not_started',
          startDate: '',
          estimatedCompletionDate: '',
          budget: '',
        });
        loadData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'review':
        return 'bg-yellow-500';
      case 'not_started':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Projects</h1>
          <p className="text-gray-400 mt-1">Manage client projects and milestones</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription className="text-gray-400">
                Set up a new project for a client
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client *</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientId: value })
                  }
                  required
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.businessName || client.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="bg-gray-700 border-gray-600"
                  placeholder="e.g., New Website Design"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                  rows={3}
                  placeholder="Project details and scope"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, projectType: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="web_app">Web Application</SelectItem>
                      <SelectItem value="automation">Automation</SelectItem>
                      <SelectItem value="redesign">Redesign</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Under Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedCompletionDate">Est. Completion</Label>
                  <Input
                    id="estimatedCompletionDate"
                    type="date"
                    value={formData.estimatedCompletionDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedCompletionDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                  placeholder="5000.00"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="bg-gray-700 border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No projects yet. Create your first project to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Project</TableHead>
                  <TableHead className="text-gray-300">Client</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Progress</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-gray-700">
                    <TableCell className="font-medium text-gray-100">
                      <div>
                        <div>{project.title}</div>
                        {project.description && (
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {project.client?.businessName || project.client?.fullName || '-'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {getStatusText(project.projectType)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="h-2 w-20" />
                        <span className="text-sm text-gray-400">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {getStatusText(project.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/projects/${project.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
