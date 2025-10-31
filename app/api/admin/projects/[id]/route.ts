
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, projectMilestones, projectNotes } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const projectId = parseInt(params.id);

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get milestones
    const milestones = await db
      .select()
      .from(projectMilestones)
      .where(eq(projectMilestones.projectId, projectId))
      .orderBy(projectMilestones.order);

    // Get notes
    const notes = await db
      .select()
      .from(projectNotes)
      .where(eq(projectNotes.projectId, projectId))
      .orderBy(desc(projectNotes.createdAt));

    return NextResponse.json({
      project: {
        ...project,
        milestones,
        notes,
      },
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    const body = await request.json();

    const [updatedProject] = await db
      .update(projects)
      .set({
        title: body.title,
        description: body.description,
        projectType: body.projectType,
        status: body.status,
        progress: body.progress,
        startDate: body.startDate ? new Date(body.startDate) : null,
        estimatedCompletionDate: body.estimatedCompletionDate
          ? new Date(body.estimatedCompletionDate)
          : null,
        completionDate: body.completionDate ? new Date(body.completionDate) : null,
        budget: body.budget,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json({
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
