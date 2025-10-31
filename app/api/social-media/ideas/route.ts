
import { NextResponse } from 'next/server';
import { generateContentIdeas } from '@/lib/openai-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    const ideas = await generateContentIdeas(count);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error generating content ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    );
  }
}
