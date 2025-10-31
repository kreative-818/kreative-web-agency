
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const keywords = await prisma.sEOKeyword.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { searchVolume: 'desc' },
      ],
    });

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const keyword = await prisma.sEOKeyword.create({
      data: {
        keyword: body.keyword,
        searchVolume: body.searchVolume,
        difficulty: body.difficulty,
        cpc: body.cpc,
        intent: body.intent,
        isPrimary: body.isPrimary || false,
        pages: body.pages || [],
      },
    });

    return NextResponse.json({ success: true, keyword });
  } catch (error) {
    console.error('Error creating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID is required' },
        { status: 400 }
      );
    }

    const keyword = await prisma.sEOKeyword.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, keyword });
  } catch (error) {
    console.error('Error updating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to update keyword' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Keyword ID is required' },
        { status: 400 }
      );
    }

    await prisma.sEOKeyword.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
}
