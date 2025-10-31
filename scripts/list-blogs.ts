import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listBlogs() {
  const posts = await prisma.blogPost.findMany({
    select: { title: true, slug: true, content: true },
    orderBy: { publishedAt: 'desc' },
    take: 15,
  });
  
  console.log(`Found ${posts.length} blog posts:\n`);
  posts.forEach(post => {
    const contentLength = post.content?.length || 0;
    const hasContent = contentLength > 1000 ? '✅' : '❌';
    console.log(`${hasContent} ${post.slug.padEnd(50)} | ${contentLength.toString().padStart(6)} chars`);
  });
  
  await prisma.$disconnect();
}

listBlogs();
