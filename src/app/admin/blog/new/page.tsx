'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { BlogPost } from '@/types/models';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (postData: Partial<BlogPost>) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog post');
      }
      
      const data = await response.json();
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error creating blog post:', err);
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
              Create New Blog Post
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Create a new blog post with rich text formatting and image uploads.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <BlogEditor 
            onSave={handleSave}
            onCancel={() => router.push('/admin/blog')}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}