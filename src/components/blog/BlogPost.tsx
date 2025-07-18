'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost as BlogPostType } from '@/types/models';
import { useAuth } from '@/components/auth/AuthProvider';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RelatedPosts } from './RelatedPosts';

interface BlogPostProps {
  post?: BlogPostType;
  slug?: string;
}

export const BlogPost = ({ post: initialPost, slug }: BlogPostProps) => {
  const [post, setPost] = useState<BlogPostType | null>(initialPost || null);
  const [loading, setLoading] = useState<boolean>(!initialPost);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
      return;
    }

    if (slug) {
      fetchPost();
    }
  }, [initialPost, slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/blog/slug/${slug}`);
      
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

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchPost}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/blog" 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="w-full max-w-4xl mx-auto">
      {/* Admin Edit Button */}
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Link 
            href={`/admin/blog/edit/${post.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Post
          </Link>
        </div>
      )}
      
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <time dateTime={new Date(post.publishedAt).toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <span>
              (Updated: {formatDate(post.updatedAt)})
            </span>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link 
              key={tag} 
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full hover:bg-secondary/80 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>
      
      {/* Post Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      
      {/* Related Posts */}
      <RelatedPosts currentPost={post} />
    </article>
  );
};