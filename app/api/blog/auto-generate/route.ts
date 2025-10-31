
import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/blog-generator';
import { prisma } from '@/lib/db';

// Topics for automatic daily generation
const autoGenerationTopics = [
  // Evergreen topics that can be regenerated
  "web design trends",
  "website optimization tips",
  "digital marketing strategies",
  "SEO best practices",
  "website development guide",
  "user experience improvements",
  "mobile app development",
  "e-commerce solutions",
  "website security updates",
  "conversion optimization",
  "content marketing ideas",
  "social media strategies",
  "business website tips",
  "landing page design",
  "website performance",
  "branding strategies",
  "customer engagement tactics",
  "online marketing tools",
  "website analytics insights",
  "digital transformation",
  "web accessibility standards",
  "cloud hosting benefits",
  "API development guide",
  "automation for businesses",
  "AI in web development",
];

// GET - Automatically generate daily blog post
export async function GET(request: NextRequest) {
  try {
    // Check authorization header for cron job
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Select a random topic
    const randomTopic = autoGenerationTopics[
      Math.floor(Math.random() * autoGenerationTopics.length)
    ];
    
    // Add current date/month to make it unique
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const keyword = `${randomTopic} ${currentMonth}`;
    
    console.log(`🤖 Auto-generating blog post for: "${keyword}"`);
    
    // Generate the blog post
    const result = await generateBlogPost({
      keyword,
      category: 'General',
      includeInternalLinks: true,
      wordCount: 1200,
    });

    if (!result.success || !result.data) {
      console.error('Failed to generate post:', result.error);
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate post' },
        { status: 500 }
      );
    }

    // Check if post already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: result.data.slug },
    });

    if (existingPost) {
      // Modify slug to make it unique
      result.data.slug = `${result.data.slug}-${Date.now()}`;
    }

    // Save to database
    const post = await prisma.blogPost.create({
      data: {
        ...result.data,
        status: 'published',
        publishedAt: new Date(),
        autoPublish: true,
      },
    });

    console.log(`✅ Auto-generated post: "${post.title}"`);

    return NextResponse.json({ 
      success: true, 
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: post.publishedAt,
      }
    });
  } catch (error) {
    console.error('Error auto-generating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to auto-generate post' },
      { status: 500 }
    );
  }
}

// POST - Manually trigger auto-generation (for testing)
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('test') === 'true';
    
    if (testMode) {
      // In test mode, just return a success without generating
      return NextResponse.json({ 
        success: true, 
        message: 'Test mode - auto-generation would trigger here' 
      });
    }
    
    // Create a new request and forward to GET handler
    const newRequest = new NextRequest(request.url, {
      method: 'GET',
      headers: new Headers({
        'authorization': `Bearer ${process.env.CRON_SECRET || 'default-secret-key'}`,
      }),
    });
    
    return GET(newRequest);
  } catch (error) {
    console.error('Error triggering auto-generation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger auto-generation' },
      { status: 500 }
    );
  }
}

