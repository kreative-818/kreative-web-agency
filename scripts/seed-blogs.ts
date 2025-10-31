
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { generateBlogPost } from '../lib/blog-generator';

const prisma = new PrismaClient();

// Comprehensive list of blog topics relevant to web agency
const blogTopics = [
  // Web Design
  { keyword: "modern website design trends 2025", category: "Web Design" },
  { keyword: "responsive web design best practices", category: "Web Design" },
  { keyword: "mobile-first design principles", category: "Web Design" },
  { keyword: "website color psychology for conversions", category: "Web Design" },
  { keyword: "minimalist web design benefits", category: "Web Design" },
  { keyword: "UX design mistakes to avoid", category: "Web Design" },
  { keyword: "website accessibility guidelines", category: "Web Design" },
  { keyword: "web design portfolio tips", category: "Web Design" },
  { keyword: "dark mode web design trends", category: "Web Design" },
  { keyword: "typography in web design", category: "Web Design" },
  
  // Web Development
  { keyword: "choosing the right web framework", category: "Web Development" },
  { keyword: "website performance optimization techniques", category: "Web Development" },
  { keyword: "progressive web apps benefits", category: "Web Development" },
  { keyword: "website security best practices", category: "Web Development" },
  { keyword: "API integration for websites", category: "Web Development" },
  { keyword: "headless CMS advantages", category: "Web Development" },
  { keyword: "website speed optimization tips", category: "Web Development" },
  { keyword: "custom web application development", category: "Web Development" },
  { keyword: "database design for web apps", category: "Web Development" },
  { keyword: "serverless architecture benefits", category: "Web Development" },
  
  // SEO & Marketing
  { keyword: "local SEO for small businesses", category: "SEO" },
  { keyword: "on-page SEO checklist 2025", category: "SEO" },
  { keyword: "content marketing strategy guide", category: "Marketing" },
  { keyword: "conversion rate optimization tips", category: "Marketing" },
  { keyword: "social media marketing for businesses", category: "Marketing" },
  { keyword: "email marketing best practices", category: "Marketing" },
  { keyword: "Google Analytics 4 setup guide", category: "SEO" },
  { keyword: "backlink building strategies", category: "SEO" },
  { keyword: "keyword research for local businesses", category: "SEO" },
  { keyword: "landing page optimization techniques", category: "Marketing" },
  
  // Business & Strategy
  { keyword: "how much does a website cost in 2025", category: "Business" },
  { keyword: "website maintenance importance", category: "Business" },
  { keyword: "choosing a web design agency", category: "Business" },
  { keyword: "website redesign checklist", category: "Business" },
  { keyword: "ROI of professional website design", category: "Business" },
  { keyword: "website vs social media for business", category: "Business" },
  { keyword: "e-commerce website requirements", category: "Business" },
  { keyword: "small business website essentials", category: "Business" },
  { keyword: "website hosting options compared", category: "Business" },
  { keyword: "domain name selection tips", category: "Business" },
  
  // Industry-Specific
  { keyword: "restaurant website design best practices", category: "Industry" },
  { keyword: "real estate website features", category: "Industry" },
  { keyword: "healthcare website compliance", category: "Industry" },
  { keyword: "law firm website design tips", category: "Industry" },
  { keyword: "fitness website must-haves", category: "Industry" },
  { keyword: "salon and spa website design", category: "Industry" },
  { keyword: "contractor website essentials", category: "Industry" },
  { keyword: "retail website design trends", category: "Industry" },
  { keyword: "professional services website tips", category: "Industry" },
  { keyword: "non-profit website design guide", category: "Industry" },
];

async function seedBlogs() {
  console.log('🌱 Starting blog seeding process...');
  
  // Calculate date range (50 posts over ~6 months)
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 180); // 6 months ago
  
  // Calculate days between posts
  const daysBetweenPosts = Math.floor(180 / blogTopics.length);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < blogTopics.length; i++) {
    const topic = blogTopics[i];
    
    // Calculate backdated publish date
    const publishDate = new Date(startDate);
    publishDate.setDate(startDate.getDate() + (i * daysBetweenPosts));
    
    try {
      console.log(`\n📝 [${i + 1}/${blogTopics.length}] Generating: "${topic.keyword}"`);
      console.log(`   📅 Date: ${publishDate.toLocaleDateString()}`);
      
      // Generate blog post with AI
      const result = await generateBlogPost({
        keyword: topic.keyword,
        category: topic.category,
        includeInternalLinks: true,
        wordCount: 1200,
      });
      
      if (!result.success || !result.data) {
        console.error(`   ❌ Failed: ${result.error}`);
        errorCount++;
        continue;
      }
      
      // Check if post with this slug already exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: result.data.slug },
      });
      
      if (existingPost) {
        console.log(`   ⚠️  Skipping: Post already exists`);
        continue;
      }
      
      // Save to database with backdated timestamp
      await prisma.blogPost.create({
        data: {
          ...result.data,
          status: 'published',
          publishedAt: publishDate,
          createdAt: publishDate,
          updatedAt: publishDate,
          autoPublish: true,
        },
      });
      
      successCount++;
      console.log(`   ✅ Success: "${result.data.title}"`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`   ❌ Error:`, error);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Blog seeding completed!');
  console.log(`✅ Success: ${successCount} posts`);
  console.log(`❌ Failed: ${errorCount} posts`);
  console.log('='.repeat(60) + '\n');
}

seedBlogs()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

