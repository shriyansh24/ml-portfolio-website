'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { BlogPost } from '@/types/models';

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/blog/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      
      const data = await response.json();
      setPost(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Failed to load blog post. Please try again later.');
      setLoading(false);
    }
  };

  const handleSave = async (postData: Partial<BlogPost>) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog post');
      }
      
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Edit Blog Post
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Edit your blog post with rich text formatting and image uploads.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
              {error === 'Failed to load blog post. Please try again later.' && (
                <button 
                  onClick={fetchPost}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
          
          {loading ? (
            <div className="w-full py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : post ? (
            <BlogEditor 
              post={post}
              onSave={handleSave}
              onCancel={() => router.push('/admin/blog')}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Blog post not found.</p>
              <button
                onClick={() => router.push('/admin/blog')}
                className="text-primary hover:underline"
              >
                Back to Blog Posts
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}