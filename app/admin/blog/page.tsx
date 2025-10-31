
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  focusKeyword: string | null;
  publishedAt: string | null;
  views: number;
  aiGenerated: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [autoPublish, setAutoPublish] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = filter !== 'all' ? `/api/blog/posts?status=${filter}` : '/api/blog/posts';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      alert('Please enter a keyword');
      return;
    }

    try {
      setGenerating(true);
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keyword.trim(),
          category: category || undefined,
          autoPublish,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Blog post generated successfully!');
        setShowGenerateModal(false);
        setKeyword('');
        setCategory('');
        setAutoPublish(false);
        fetchPosts();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error generating post:', error);
      alert('Failed to generate blog post');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/blog/posts?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        alert('Post deleted successfully');
        fetchPosts();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch('/api/blog/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'published',
          publishedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Post published successfully!');
        fetchPosts();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600 mt-1">Create, manage, and publish blog posts</p>
            </div>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Generate with AI
            </button>
          </div>

          <Link
            href="/admin"
            className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'published'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'draft'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-4">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No blog posts found</p>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Generate your first post
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="font-medium text-gray-900 hover:text-indigo-600"
                          >
                            {post.title}
                          </Link>
                          {post.aiGenerated && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              AI
                            </span>
                          )}
                          <div className="text-sm text-gray-500 mt-1">
                            /{post.slug}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.category || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : post.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {post.publishedAt
                          ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {post.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(post.id)}
                              className="text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                              Publish
                            </button>
                          )}
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Total Posts</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{posts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Published</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {posts.filter((p) => p.status === 'published').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Drafts</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {posts.filter((p) => p.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Total Views</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Generate Blog Post with AI
            </h2>
            <p className="text-gray-600 mb-6">
              Enter a keyword or topic, and our AI will create a complete SEO-optimized blog post.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Keyword *
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., web design best practices"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category (Optional)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Choose a category</option>
                  <option value="Web Design">Web Design</option>
                  <option value="SEO">SEO</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Development">Development</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoPublish"
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoPublish" className="text-sm text-gray-700">
                  Auto-publish immediately (otherwise save as draft)
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-gray-400"
              >
                {generating ? 'Generating...' : 'Generate Post'}
              </button>
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setKeyword('');
                  setCategory('');
                  setAutoPublish(false);
                }}
                disabled={generating}
                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50 transition disabled:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
