
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projectMilestones } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const projectId = parseInt(params.id);
    const body = await request.json();

    const [milestone] = await db
      .insert(projectMilestones)
      .values({
        projectId,
        title: body.title,
        description: body.description || null,
        order: body.order,
        status: body.status || 'pending',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      milestone,
    });
  } catch (error) {
    console.error('Error creating milestone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
