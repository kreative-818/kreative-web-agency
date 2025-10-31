
import { NextRequest, NextResponse } from 'next/server';
import { getClientPortalSession } from '@/lib/client-auth';
import { db } from '@/lib/db';
import { projects, projectMilestones, projectNotes } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getClientPortalSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all projects for this client
    const clientProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.clientId, user.clientId))
      .orderBy(desc(projects.createdAt));

    // Get milestones and notes for each project
    const projectsWithDetails = await Promise.all(
      clientProjects.map(async (project) => {
        const milestones = await db
          .select()
          .from(projectMilestones)
          .where(eq(projectMilestones.projectId, project.id))
          .orderBy(projectMilestones.order);

        const notes = await db
          .select()
          .from(projectNotes)
          .where(
            and(
              eq(projectNotes.projectId, project.id),
              eq(projectNotes.isInternal, false) // Only show non-internal notes
            )
          )
          .orderBy(desc(projectNotes.createdAt))
          .limit(5);

        return {
          ...project,
          milestones,
          notes,
        };
      })
    );

    return NextResponse.json({
      projects: projectsWithDetails,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
