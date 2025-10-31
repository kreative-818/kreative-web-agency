
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projectNotes } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    const body = await request.json();

    const [note] = await db
      .insert(projectNotes)
      .values({
        projectId,
        authorId: null,
        authorType: body.authorType || 'admin',
        content: body.content,
        isInternal: body.isInternal || false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
