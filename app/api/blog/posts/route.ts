
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to check admin auth
async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    return !!sessionCookie?.value;
  } catch {
    return false;
  }
}

// GET - Fetch all blog posts (public/admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const isAdmin = await isAdminAuthenticated();

    const where: any = {};

    // Public users only see published posts
    if (!isAdmin) {
      where.status = 'published';
      where.publishedAt = { lte: new Date() };
    } else {
      // Admin can filter by status
      if (status) where.status = status;
    }

    if (category) where.category = category;

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { 
        publishedAt: 'desc',
        createdAt: 'desc' 
      },
      take: limit,
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Auto-generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Set publishedAt if status is published
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        targetKeywords: data.targetKeywords || [],
        tags: data.tags || [],
        internalLinks: data.internalLinks || [],
        externalLinks: data.externalLinks || [],
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    
    // Handle unique constraint violation for slug
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PATCH - Update blog post (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Set publishedAt if status changed to published
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        lastModifiedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
