
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (status) where.status = status;
    if (platform) {
      where.platforms = {
        has: platform,
      };
    }

    const posts = await prisma.socialMediaPost.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const post = await prisma.socialMediaPost.create({
      data: {
        content: body.content,
        caption: body.caption,
        hashtags: body.hashtags || [],
        mediaUrls: body.mediaUrls || [],
        mediaType: body.mediaType || 'text',
        platforms: body.platforms || [],
        status: body.status || 'draft',
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
        contentPillar: body.contentPillar,
        aiGenerated: body.aiGenerated || false,
        aiPrompt: body.aiPrompt,
        createdBy: body.createdBy || 'admin',
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
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
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Convert scheduledFor to Date if provided
    if (data.scheduledFor) {
      data.scheduledFor = new Date(data.scheduledFor);
    }

    const post = await prisma.socialMediaPost.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
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
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await prisma.socialMediaPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
