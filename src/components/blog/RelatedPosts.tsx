'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/models';
import { findRelatedPosts } from '@/lib/searchUtils';

interface RelatedPostsProps {
  currentPost: BlogPost;
  initialRelatedPosts?: BlogPost[];
  limit?: number;
}

export const RelatedPosts = ({
  currentPost,
  initialRelatedPosts,
  limit = 3
}: RelatedPostsProps) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>(initialRelatedPosts || []);
  const [loading, setLoading] = useState<boolean>(!initialRelatedPosts);

  useEffect(() => {
    if (initialRelatedPosts) {
      setRelatedPosts(initialRelatedPosts);
      return;
    }

    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        // Fetch all posts to find related ones
        const response = await fetch('/api/blog?limit=100');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const data = await response.json();
        const allPosts = data.posts as BlogPost[];
        
        // Find related posts using the utility function
        const related = findRelatedPosts(currentPost, allPosts, limit);
        setRelatedPosts(related);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching related posts:', error);
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPost, initialRelatedPosts, limit]);

  if (loading) {
    return (
      <div className="w-full py-4">
        <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-muted rounded animate-pulse mb-2 w-3/4"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <div key={post.id} className="border border-border rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link 
                href={`/blog/${post.slug}`} 
                className="text-sm text-primary hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};