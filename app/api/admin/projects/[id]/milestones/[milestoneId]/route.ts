
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projectMilestones } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  try {

    const milestoneId = parseInt(params.milestoneId);
    const body = await request.json();

    const updates: any = {
      title: body.title,
      description: body.description,
      order: body.order,
      status: body.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      updatedAt: new Date(),
    };

    // If status changed to completed, set completedAt
    if (body.status === 'completed' && !body.completedAt) {
      updates.completedAt = new Date();
    }

    const [updatedMilestone] = await db
      .update(projectMilestones)
      .set(updates)
      .where(eq(projectMilestones.id, milestoneId))
      .returning();

    return NextResponse.json({
      success: true,
      milestone: updatedMilestone,
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
