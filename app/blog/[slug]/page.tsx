
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== 'published') {
    return null;
  }

  return post;
}

async function getRelatedPosts(currentPostId: string, category: string | null) {
  if (!category) return [];

  return await prisma.blogPost.findMany({
    where: {
      status: 'published',
      category,
      id: { not: currentPostId },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    keywords: post.targetKeywords.join(', '),
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt || undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>
          {' / '}
          <Link href="/blog" className="hover:text-indigo-600">
            Blog
          </Link>
          {' / '}
          <span className="text-gray-900">{post.title}</span>
        </nav>

        {/* Category */}
        {post.category && (
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full mb-4">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-gray-600 mb-8">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Draft'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{post.views} views</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/9] bg-gray-200 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-indigo-100 mb-6">
            Let's bring your vision to life. Get a free quote for your project today.
          </p>
          <Link
            href="/get-quote"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Your Free Quote
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group"
                >
                  {related.featuredImage && (
                    <div className="relative aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={related.featuredImage}
                        alt={related.featuredImageAlt || related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
                    {related.title}
                  </h3>
                  {related.excerpt && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {related.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
