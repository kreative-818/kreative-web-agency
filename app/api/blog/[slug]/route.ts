
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Fetch single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Only return published posts to non-admin users
    if (post.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
