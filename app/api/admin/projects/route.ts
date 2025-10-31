
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, clients } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const allProjects = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));

    // Get client info for each project
    const projectsWithClients = await Promise.all(
      allProjects.map(async (project) => {
        const [client] = await db
          .select()
          .from(clients)
          .where(eq(clients.id, project.clientId))
          .limit(1);

        return {
          ...project,
          client,
        };
      })
    );

    return NextResponse.json({ projects: projectsWithClients });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      title,
      description,
      projectType,
      status,
      startDate,
      estimatedCompletionDate,
      budget,
    } = body;

    if (!clientId || !title || !projectType) {
      return NextResponse.json(
        { error: 'Client, title, and project type are required' },
        { status: 400 }
      );
    }

    const [project] = await db
      .insert(projects)
      .values({
        clientId,
        title,
        description: description || null,
        projectType,
        status: status || 'not_started',
        progress: 0,
        startDate: startDate ? new Date(startDate) : null,
        estimatedCompletionDate: estimatedCompletionDate
          ? new Date(estimatedCompletionDate)
          : null,
        budget: budget || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully',
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
