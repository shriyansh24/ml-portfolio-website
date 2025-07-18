'use client';

import { BlogPost } from '@/types/models';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDate } from '@/lib/utils';

interface BlogPreviewProps {
  post: Partial<BlogPost>;
}

export const BlogPreview = ({ post }: BlogPreviewProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto border border-gray-200 rounded-lg p-6 bg-white dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-4">{post.title || 'Untitled Post'}</h1>
      
      {/* Date */}
      {post.publishedAt && (
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {formatDate(post.publishedAt)}
        </div>
      )}
      
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Content */}
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
          {post.content || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
};