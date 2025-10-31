
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateSocialMediaContent } from '@/lib/openai-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, platforms, contentType, tone, scheduledFor } = body;

    if (!topic || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Topic and at least one platform are required' },
        { status: 400 }
      );
    }

    // Generate content for the first platform
    const primaryPlatform = platforms[0];
    const generated = await generateSocialMediaContent({
      topic,
      platform: primaryPlatform,
      contentType: contentType || 'educational',
      tone: tone || 'professional',
    });

    // Create the post in the database
    const post = await prisma.socialMediaPost.create({
      data: {
        content: generated.content,
        caption: generated.caption,
        hashtags: generated.hashtags,
        platforms: platforms,
        contentPillar: contentType?.toUpperCase() || 'EDUCATIONAL',
        aiGenerated: true,
        aiPrompt: topic,
        status: scheduledFor ? 'scheduled' : 'draft',
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        mediaType: 'text',
        createdBy: 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      post,
      generated,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: (error as Error).message },
      { status: 500 }
    );
  }
}
