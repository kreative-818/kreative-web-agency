
import { openai } from './openai-client';

export interface BlogGenerationOptions {
  keyword: string;
  category?: string;
  tone?: 'professional' | 'casual' | 'technical';
  includeInternalLinks?: boolean;
  wordCount?: number;
}

export async function generateBlogPost(options: BlogGenerationOptions) {
  const {
    keyword,
    category = 'Web Development',
    tone = 'professional',
    includeInternalLinks = true,
    wordCount = 1200,
  } = options;

  const systemPrompt = `You are an expert content writer for Kreative Web Agency, a modern web design and development agency.
Write SEO-optimized, engaging blog articles that showcase expertise while being helpful to readers.
Follow these guidelines:
- Write in a ${tone} tone
- Target approximately ${wordCount} words
- Use proper HTML formatting with semantic tags
- Include H2 and H3 headings for structure
- Add relevant examples and actionable tips
- Write compelling meta descriptions (150-160 characters)
- Create engaging titles (50-60 characters)
${includeInternalLinks ? '- Include 2-3 internal links to relevant service pages' : ''}`;

  const userPrompt = `Write a comprehensive blog article about: "${keyword}"
Category: ${category}

The article should:
1. Have an attention-grabbing title
2. Include a compelling excerpt/introduction (2-3 sentences)
3. Be well-structured with H2/H3 headings
4. Provide actionable insights and examples
5. Target the keyword naturally throughout
6. Include a strong call-to-action at the end

${includeInternalLinks ? `
Relevant service pages to link to:
- /services (Main services page)
- /get-quote (Quote request page)
- /portfolio (Portfolio showcase)
- /about (About the agency)
` : ''}

Return your response in this exact JSON format:
{
  "title": "SEO-optimized title here",
  "slug": "url-friendly-slug-here",
  "content": "Full HTML content with proper semantic markup",
  "excerpt": "Brief 2-3 sentence summary",
  "metaTitle": "SEO meta title (50-60 chars)",
  "metaDescription": "SEO meta description (150-160 chars)",
  "category": "${category}",
  "tags": ["tag1", "tag2", "tag3"],
  "focusKeyword": "${keyword}",
  "targetKeywords": ["${keyword}", "related-keyword-1", "related-keyword-2"],
  "internalLinks": ["/services", "/get-quote"],
  "externalLinks": []
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No content generated');
    }

    const blogData = JSON.parse(responseText);

    return {
      success: true,
      data: {
        ...blogData,
        aiGenerated: true,
        aiPrompt: `Generate blog post for keyword: ${keyword}`,
      },
    };
  } catch (error) {
    console.error('Error generating blog post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate blog post',
    };
  }
}

export async function generateBlogIdeas(count: number = 10) {
  const prompt = `Generate ${count} high-value blog post ideas for a web design and development agency.
Focus on topics that:
- Target commercial intent keywords
- Showcase agency expertise
- Help potential clients make decisions
- Drive conversions

Return a JSON array of objects with this structure:
{
  "title": "Article title",
  "keyword": "Primary keyword to target",
  "category": "Web Design|SEO|Marketing|Development",
  "searchIntent": "commercial|informational|transactional",
  "priority": 1-10 (10 being highest priority)
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No ideas generated');
    }

    const result = JSON.parse(responseText);
    return {
      success: true,
      ideas: result.ideas || result,
    };
  } catch (error) {
    console.error('Error generating blog ideas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate ideas',
    };
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
