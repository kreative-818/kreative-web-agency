
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateBlogPost, generateBlogIdeas } from '@/lib/blog-generator';
import { prisma } from '@/lib/db';

async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    return !!sessionCookie?.value;
  } catch {
    return false;
  }
}

// POST - Generate blog post with AI
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { keyword, category, autoPublish } = body;

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: 'Keyword is required' },
        { status: 400 }
      );
    }

    // Generate the blog post
    const result = await generateBlogPost({
      keyword,
      category,
      includeInternalLinks: true,
      wordCount: 1200,
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate post' },
        { status: 500 }
      );
    }

    // Save to database
    const post = await prisma.blogPost.create({
      data: {
        ...result.data,
        status: autoPublish ? 'published' : 'draft',
        publishedAt: autoPublish ? new Date() : undefined,
        autoPublish: autoPublish || false,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate post' },
      { status: 500 }
    );
  }
}

// GET - Generate blog ideas
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    const result = await generateBlogIdeas(count);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, ideas: result.ideas });
  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}
