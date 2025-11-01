export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = {
  title: 'Blog - Web Design & Development Tips | Kreative Web Agency',
  description: 'Expert insights on web design, development, SEO, and digital marketing. Learn from the professionals at Kreative Web Agency.',
};

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'published',
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });
  return posts;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Get unique categories
  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Web Design & Development Blog
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Expert insights, tips, and strategies to help your business succeed online
          </p>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition"
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${category}`}
                className="px-4 py-2 rounded-full bg-white text-gray-700 font-medium text-sm hover:bg-gray-100 transition border"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No blog posts published yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
              >
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative aspect-[16/9] bg-gray-200">
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </span>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {post.publishedAt
                        ? formatDistanceToNow(new Date(post.publishedAt), {
                            addSuffix: true,
                          })
                        : 'Draft'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
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
                      {post.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Online Presence?
          </h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Let's discuss your project and create something amazing together.
          </p>
          <Link
            href="/get-quote"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
