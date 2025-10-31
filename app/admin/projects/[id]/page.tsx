
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  MessageSquare,
} from 'lucide-react';

interface Milestone {
  id?: number;
  title: string;
  description: string;
  order: number;
  status: string;
  dueDate: string;
  completedAt?: string;
}

interface ProjectNote {
  id?: number;
  content: string;
  authorType: string;
  isInternal: boolean;
  createdAt?: string;
}

interface ProjectData {
  id: number;
  clientId: number;
  title: string;
  description: string;
  projectType: string;
  status: string;
  progress: number;
  startDate: string;
  estimatedCompletionDate: string;
  completionDate?: string;
  budget: number;
  milestones: Milestone[];
  notes: ProjectNote[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [newNote, setNewNote] = useState('');
  const [noteIsInternal, setNoteIsInternal] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    title: '',
    description: '',
    order: 1,
    status: 'pending',
    dueDate: '',
  });

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        
        // Set next milestone order
        if (data.project.milestones.length > 0) {
          const maxOrder = Math.max(...data.project.milestones.map((m: Milestone) => m.order));
          setNewMilestone({ ...newMilestone, order: maxOrder + 1 });
        }
      } else {
        toast.error('Project not found');
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!project) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        toast.success('Project updated successfully!');
        loadProject();
      } else {
        toast.error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title) {
      toast.error('Milestone title is required');
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMilestone),
      });

      if (response.ok) {
        toast.success('Milestone added!');
        setNewMilestone({
          title: '',
          description: '',
          order: newMilestone.order + 1,
          status: 'pending',
          dueDate: '',
        });
        loadProject();
      } else {
        toast.error('Failed to add milestone');
      }
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error('Failed to add milestone');
    }
  };

  const handleUpdateMilestone = async (milestone: Milestone) => {
    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/milestones/${milestone.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(milestone),
        }
      );

      if (response.ok) {
        toast.success('Milestone updated!');
        loadProject();
      } else {
        toast.error('Failed to update milestone');
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast.error('Failed to update milestone');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Note content is required');
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote,
          authorType: 'admin',
          isInternal: noteIsInternal,
        }),
      });

      if (response.ok) {
        toast.success('Note added!');
        setNewNote('');
        setNoteIsInternal(false);
        loadProject();
      } else {
        toast.error('Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const calculateProgress = () => {
    if (!project || project.milestones.length === 0) return 0;
    
    const completed = project.milestones.filter((m) => m.status === 'completed').length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/admin/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">{project.title}</h1>
            <p className="text-gray-400 mt-1">Project ID: {project.id}</p>
          </div>
        </div>
        <Button onClick={handleUpdateProject} disabled={saving} className="bg-purple-600">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Progress Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Overall Progress</span>
              <span className="text-lg font-bold text-purple-400">{calculateProgress()}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-3" />
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div>
                <Label className="text-gray-300">Status</Label>
                <Select
                  value={project.status}
                  onValueChange={(value) => setProject({ ...project, status: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700">
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Start Date</Label>
                <Input
                  type="date"
                  value={project.startDate ? project.startDate.split('T')[0] : ''}
                  onChange={(e) => setProject({ ...project, startDate: e.target.value })}
                  className="bg-gray-700 border-gray-600 mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-300">Est. Completion</Label>
                <Input
                  type="date"
                  value={
                    project.estimatedCompletionDate
                      ? project.estimatedCompletionDate.split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setProject({ ...project, estimatedCompletionDate: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-300">Budget</Label>
                <Input
                  type="number"
                  value={project.budget ? project.budget / 100 : ''}
                  onChange={(e) =>
                    setProject({ ...project, budget: parseFloat(e.target.value) * 100 })
                  }
                  className="bg-gray-700 border-gray-600 mt-2"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.milestones
            .sort((a, b) => a.order - b.order)
            .map((milestone) => (
              <div
                key={milestone.id}
                className="p-4 rounded-lg bg-gray-700/50 border border-gray-600"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {milestone.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : milestone.status === 'in_progress' ? (
                      <Clock className="h-6 w-6 text-blue-500" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 text-xs">Title</Label>
                      <Input
                        value={milestone.title}
                        onChange={(e) => {
                          const updated = project.milestones.map((m) =>
                            m.id === milestone.id ? { ...m, title: e.target.value } : m
                          );
                          setProject({ ...project, milestones: updated });
                        }}
                        className="bg-gray-700 border-gray-600 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Status</Label>
                      <Select
                        value={milestone.status}
                        onValueChange={(value) => {
                          const updated = project.milestones.map((m) =>
                            m.id === milestone.id ? { ...m, status: value } : m
                          );
                          setProject({ ...project, milestones: updated });
                          handleUpdateMilestone({ ...milestone, status: value });
                        }}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <Separator className="bg-gray-600" />

          {/* Add New Milestone */}
          <div className="p-4 rounded-lg bg-gray-700/30 border border-dashed border-gray-600">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Add New Milestone</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
              <Input
                placeholder="Description"
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, description: e.target.value })
                }
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <Button onClick={handleAddMilestone} className="mt-3 bg-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Project Notes & Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Note */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add a note or update..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="bg-gray-700 border-gray-600"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={noteIsInternal}
                  onCheckedChange={setNoteIsInternal}
                  id="internal"
                />
                <Label htmlFor="internal" className="text-gray-300 text-sm">
                  Internal note (hidden from client)
                </Label>
              </div>
              <Button onClick={handleAddNote} className="bg-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Notes List */}
          <div className="space-y-3">
            {project.notes.length === 0 ? (
              <p className="text-center text-gray-400 py-4">No notes yet</p>
            ) : (
              project.notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg ${
                    note.isInternal
                      ? 'bg-yellow-900/20 border border-yellow-700/50'
                      : 'bg-gray-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-300">{note.content}</p>
                    {note.isInternal && (
                      <Badge variant="secondary" className="ml-2">
                        Internal
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {note.createdAt && new Date(note.createdAt).toLocaleDateString()} •{' '}
                    {note.authorType === 'admin' ? 'Team' : 'Client'}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
