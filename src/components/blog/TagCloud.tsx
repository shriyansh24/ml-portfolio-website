'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { extractUniqueTags } from '@/lib/searchUtils';
import { BlogPost } from '@/types/models';

interface TagCloudProps {
  initialTags?: string[];
  initialPosts?: BlogPost[];
  className?: string;
  limit?: number;
}

export const TagCloud = ({
  initialTags,
  initialPosts,
  className = '',
  limit = 20
}: TagCloudProps) => {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [loading, setLoading] = useState<boolean>(!initialTags && !initialPosts);
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');

  useEffect(() => {
    if (initialTags) {
      setTags(initialTags);
      return;
    }

    if (initialPosts) {
      setTags(extractUniqueTags(initialPosts));
      return;
    }

    const fetchTags = async () => {
      try {
        setLoading(true);
        // Fetch all posts to extract tags
        const response = await fetch('/api/blog/tags');
        
        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }
        
        const data = await response.json();
        setTags(data.tags);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setLoading(false);
      }
    };

    fetchTags();
  }, [initialTags, initialPosts]);

  if (loading) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className="h-8 bg-muted rounded animate-pulse" 
            style={{ width: `${Math.floor(Math.random() * 60) + 40}px` }}
          ></div>
        ))}
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  // Limit the number of tags displayed
  const displayTags = tags.slice(0, limit);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Link
        href="/blog"
        className={`text-sm px-3 py-1 rounded-full transition-colors ${
          !activeTag
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        All
      </Link>
      {displayTags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            activeTag === tag
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
};