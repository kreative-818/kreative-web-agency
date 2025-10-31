
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.ABACUSAI_API_KEY,
  baseURL: 'https://apps.abacus.ai/v1',
});

export { openai };

export async function generateSocialMediaContent(params: {
  topic: string;
  platform: 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
  contentType: 'educational' | 'portfolio' | 'behind-the-scenes' | 'industry';
  tone?: 'professional' | 'casual' | 'enthusiastic';
}): Promise<{ content: string; hashtags: string[]; caption?: string }> {
  const { topic, platform, contentType, tone = 'professional' } = params;

  const platformGuidelines = {
    TIKTOK: 'Keep it short, engaging, use trending sounds/hooks. Max 2200 characters. Include 3-5 relevant hashtags.',
    INSTAGRAM: 'Visual-first, use emojis, storytelling. Max 2200 characters. Include 5-15 relevant hashtags.',
    FACEBOOK: 'More detailed, conversational. Can be longer. Include 3-5 relevant hashtags.',
  };

  const contentTypePrompts = {
    educational: 'Create educational content teaching something valuable about web design/development',
    portfolio: 'Showcase a project or client work with impressive results',
    'behind-the-scenes': 'Share authentic behind-the-scenes content about the agency process',
    industry: 'Share industry insights, trends, or news',
  };

  const prompt = `You are a social media content creator for Kreative Web Agency, a professional web design and development company.

Create engaging social media content for ${platform} about: ${topic}

Content Type: ${contentTypePrompts[contentType]}
Tone: ${tone}
Platform Guidelines: ${platformGuidelines[platform]}

Generate:
1. Main content/caption (engaging, valuable, platform-appropriate)
2. Relevant hashtags (mix of popular and niche)
3. Call-to-action (subtle, natural)

Format your response as JSON:
{
  "content": "the main post content",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "caption": "optional shorter caption for visual posts"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      content: result.content || '',
      hashtags: result.hashtags || [],
      caption: result.caption,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate social media content');
  }
}

export async function generateContentIdeas(count: number = 10): Promise<string[]> {
  const prompt = `Generate ${count} engaging social media content ideas for a web design/development agency called Kreative Web Agency.

Focus on:
- Web design tips and tutorials
- Development best practices
- Client success stories
- Industry trends and insights
- Behind-the-scenes content
- Problem-solving and how-tos

Return as a JSON array of strings:
["idea 1", "idea 2", ...]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"ideas": []}');
    return result.ideas || [];
  } catch (error) {
    console.error('Error generating content ideas:', error);
    return [];
  }
}
