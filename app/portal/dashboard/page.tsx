
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Clock,
  FileText,
  LogOut,
  Loader2,
  Calendar,
  DollarSign,
  MessageSquare,
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
}

interface Client {
  id: number;
  fullName: string;
  email: string;
  businessName?: string;
  status: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  projectType: string;
  status: string;
  progress: number;
  startDate?: string;
  estimatedCompletionDate?: string;
  completionDate?: string;
  budget?: number;
  milestones: Milestone[];
  notes: ProjectNote[];
}

interface Milestone {
  id: number;
  title: string;
  description?: string;
  order: number;
  status: string;
  dueDate?: string;
  completedAt?: string;
}

interface ProjectNote {
  id: number;
  content: string;
  authorType: string;
  createdAt: string;
}

export default function PortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get user session
      const meResponse = await fetch('/api/portal/me');
      if (!meResponse.ok) {
        router.push('/portal/login');
        return;
      }
      const meData = await meResponse.json();
      setUser(meData.user);
      setClient(meData.client);

      // Get projects
      const projectsResponse = await fetch('/api/portal/projects');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
      }
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/portal/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/portal/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'review':
        return 'Under Review';
      case 'not_started':
        return 'Not Started';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/logo-transparent.png"
                  alt="Kreative Intelligence"
                  fill
                  className="object-contain
                    drop-shadow-[0_0_8px_rgba(147,51,234,0.6)] 
                    drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.fullName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {client?.businessName || client?.fullName}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your projects will appear here once they&apos;re set up by our team.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{project.title}</CardTitle>
                      {project.description && (
                        <CardDescription className="text-purple-100 mt-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge
                      className={`${getStatusColor(project.status)} text-white`}
                    >
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Progress Bar - Pizza Tracker Style */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Overall Progress
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-3" />
                  </div>

                  {/* Milestones - Pizza Tracker */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-purple-600" />
                      Project Milestones
                    </h3>
                    <div className="space-y-3">
                      {project.milestones
                        .sort((a, b) => a.order - b.order)
                        .map((milestone, index) => (
                          <div
                            key={milestone.id}
                            className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                          >
                            <div className="flex-shrink-0 mt-1">
                              {milestone.status === 'completed' ? (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                              ) : milestone.status === 'in_progress' ? (
                                <Clock className="h-6 w-6 text-blue-500 animate-pulse" />
                              ) : (
                                <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {milestone.title}
                                  </p>
                                  {milestone.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {milestone.description}
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  variant={
                                    milestone.status === 'completed'
                                      ? 'default'
                                      : milestone.status === 'in_progress'
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                  className="ml-2"
                                >
                                  {getStatusText(milestone.status)}
                                </Badge>
                              </div>
                              {milestone.completedAt && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                  ✓ Completed on{' '}
                                  {new Date(milestone.completedAt).toLocaleDateString()}
                                </p>
                              )}
                              {milestone.dueDate && !milestone.completedAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Project Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {project.startDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Started</p>
                          <p className="text-sm font-medium">
                            {new Date(project.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {project.estimatedCompletionDate && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Est. Completion</p>
                          <p className="text-sm font-medium">
                            {new Date(project.estimatedCompletionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {project.budget && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="text-sm font-medium">
                            ${(project.budget / 100).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recent Updates/Notes */}
                  {project.notes.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                          Recent Updates
                        </h3>
                        <div className="space-y-3">
                          {project.notes.slice(0, 3).map((note) => (
                            <div
                              key={note.id}
                              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                            >
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {note.content}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(note.createdAt).toLocaleDateString()} •{' '}
                                {note.authorType === 'admin' ? 'Team' : 'You'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              We&apos;re here to support you throughout your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📧 Email:{' '}
                <a
                  href="mailto:support@kreativewebagency.com"
                  className="text-purple-600 hover:underline"
                >
                  support@kreativewebagency.com
                </a>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📞 Phone:{' '}
                <a href="tel:+17045551234" className="text-purple-600 hover:underline">
                  (704) 555-1234
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
