import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { generateBlogPost } from '../lib/blog-generator';

const prisma = new PrismaClient();

async function regenerateBlogs() {
  console.log('🔄 Starting blog regeneration...');
  
  // Get all published blog posts
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  });
  
  console.log(`Found ${posts.length} published posts\n`);
  
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const post of posts) {
    // Skip if content already has significant length
    if (post.content && post.content.length > 5000) {
      console.log(`✅ Skipping "${post.title}" - already has content (${post.content.length} chars)`);
      continue;
    }
    
    console.log(`\n📝 Regenerating: "${post.title}"`);
    console.log(`   Keyword: ${post.focusKeyword}`);
    
    try {
      // Generate new content using AI
      const result = await generateBlogPost({
        keyword: post.focusKeyword || post.title,
        category: post.category || 'Web Development',
        includeInternalLinks: true,
        wordCount: 1200,
      });
      
      if (!result.success || !result.data) {
        console.error(`   ❌ Failed: ${result.error}`);
        errorCount++;
        continue;
      }
      
      // Update the post with new content
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          content: result.data.content,
          excerpt: result.data.excerpt || post.excerpt,
          metaTitle: result.data.metaTitle || post.metaTitle,
          metaDescription: result.data.metaDescription || post.metaDescription,
          targetKeywords: result.data.targetKeywords || post.targetKeywords,
          tags: result.data.tags || post.tags,
          internalLinks: result.data.internalLinks || post.internalLinks,
          lastModifiedAt: new Date(),
        },
      });
      
      updatedCount++;
      console.log(`   ✅ Success: Updated with ${result.data.content.length} characters`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`   ❌ Error:`, error);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Blog regeneration completed!');
  console.log(`✅ Updated: ${updatedCount} posts`);
  console.log(`❌ Failed: ${errorCount} posts`);
  console.log('='.repeat(60) + '\n');
}

regenerateBlogs()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
