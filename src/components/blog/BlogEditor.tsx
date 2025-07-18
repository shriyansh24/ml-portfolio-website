'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types/models';
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { BlogPreview } from './BlogPreview';
import MediaSelector from '../media/MediaSelector';

// Import the editor component dynamically to avoid SSR issues
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-md"></div>
});

// Initialize markdown parser with syntax highlighting
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
});

interface BlogEditorProps {
  post?: BlogPost;
  onSave?: (post: Partial<BlogPost>) => Promise<void>;
  onCancel?: () => void;
}

export const BlogEditor = ({ post, onSave, onCancel }: BlogEditorProps) => {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(post?.featured || false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle markdown editor change
  const handleEditorChange = ({ html, text }: { html: string, text: string }) => {
    setContent(text);
  };

  // Fetch all existing tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/blog/tags');
        if (response.ok) {
          const data = await response.json();
          setAllTags(data.tags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    
    fetchTags();
  }, []);

  // Update tag suggestions when tag input changes
  useEffect(() => {
    if (tagInput.trim()) {
      const input = tagInput.trim().toLowerCase();
      const filtered = allTags.filter(tag => 
        tag.toLowerCase().includes(input) && !tags.includes(tag)
      );
      setTagSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setTagSuggestions([]);
      setShowSuggestions(false);
    }
  }, [tagInput, allTags, tags]);

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      
      setTagInput('');
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown' && showSuggestions && tagSuggestions.length > 0) {
      e.preventDefault();
      // Focus on the first suggestion
      const suggestionElement = document.getElementById('tag-suggestion-0');
      if (suggestionElement) {
        suggestionElement.focus();
      }
    }
  };

  // Handle tag suggestion selection
  const handleTagSuggestionSelect = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
    setShowSuggestions(false);
  };

  // Handle tag suggestion keyboard navigation
  const handleTagSuggestionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number, tag: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagSuggestionSelect(tag);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % tagSuggestions.length;
      const nextElement = document.getElementById(`tag-suggestion-${nextIndex}`);
      if (nextElement) {
        nextElement.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + tagSuggestions.length) % tagSuggestions.length;
      const prevElement = document.getElementById(`tag-suggestion-${prevIndex}`);
      if (prevElement) {
        prevElement.focus();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      // Focus back on the input
      const inputElement = document.getElementById('tags');
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }, []);

  // Handle image upload button click
  const onImageUpload = useCallback((file: File) => {
    return handleImageUpload(file).then(url => {
      return url;
    });
  }, [handleImageUpload]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !excerpt) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      const postData: Partial<BlogPost> = {
        title,
        content,
        excerpt,
        tags,
        featured,
        updatedAt: new Date(),
      };
      
      if (!post) {
        postData.publishedAt = new Date();
      }
      
      if (onSave) {
        await onSave(postData);
      } else {
        // Default save behavior if no onSave prop is provided
        const endpoint = post ? `/api/blog/${post.id}` : '/api/blog';
        const method = post ? 'PUT' : 'POST';
        
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save blog post');
        }
        
        router.push('/admin/blog');
      }
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="w-full">
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {isPreview ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Preview</h2>
            <button
              type="button"
              onClick={togglePreview}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Editor
            </button>
          </div>
          
          <BlogPreview 
            post={{
              title,
              content,
              tags,
              publishedAt: new Date(),
              updatedAt: new Date(),
              excerpt,
              featured
            }} 
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter post title"
              required
            />
          </div>
          
          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter a brief summary of the post"
              rows={3}
              required
            />
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Add tags (press Enter or comma to add)"
              />
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {tagSuggestions.map((tag, index) => (
                    <button
                      key={tag}
                      id={`tag-suggestion-${index}`}
                      type="button"
                      onClick={() => handleTagSuggestionSelect(tag)}
                      onKeyDown={(e) => handleTagSuggestionKeyDown(e, index, tag)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Featured toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Featured post
            </label>
          </div>
          
          {/* Media Browser */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Featured Image
            </label>
            <MediaSelector 
              label="Select Featured Image"
              value=""
              onChange={(url) => {
                // Insert the image at the beginning of the content
                const imageMarkdown = `![Featured Image](${url})\n\n`;
                if (!content.includes(imageMarkdown)) {
                  setContent(imageMarkdown + content);
                }
              }}
            />
          </div>
          
          {/* Markdown Editor */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content *
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => {
                  // Show media selector modal
                  const mediaSelector = document.createElement('div');
                  mediaSelector.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                  
                  const modalContent = document.createElement('div');
                  modalContent.className = 'bg-white rounded-lg shadow-lg max-w-4xl w-full p-6';
                  
                  const header = document.createElement('div');
                  header.className = 'flex justify-between items-center mb-4';
                  header.innerHTML = `
                    <h3 class="text-lg font-semibold">Insert Media</h3>
                    <button type="button" class="text-gray-500 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  `;
                  
                  modalContent.appendChild(header);
                  mediaSelector.appendChild(modalContent);
                  
                  // Render the MediaSelector component
                  const root = document.createElement('div');
                  root.id = 'media-selector-root';
                  modalContent.appendChild(root);
                  
                  document.body.appendChild(mediaSelector);
                  
                  // Close button functionality
                  header.querySelector('button')?.addEventListener('click', () => {
                    document.body.removeChild(mediaSelector);
                  });
                  
                  // Create a custom MediaSelector component
                  const mediaManager = document.createElement('div');
                  mediaManager.innerHTML = `
                    <iframe src="/admin/media" style="width: 100%; height: 500px; border: none;"></iframe>
                  `;
                  root.appendChild(mediaManager);
                }}
              >
                Browse Media Library
              </button>
            </div>
            <MdEditor
              style={{ height: '500px' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              value={content}
              placeholder="Write your blog post content here..."
              config={{
                view: { menu: true, md: true, html: false },
                canView: { menu: true, md: true, html: false, fullScreen: true, hideMenu: true },
                htmlClass: 'prose prose-lg max-w-none',
                markdownClass: 'markdown-body',
              }}
              plugins={[
                'header',
                'font-bold',
                'font-italic',
                'font-underline',
                'list-unordered',
                'list-ordered',
                'block-quote',
                'block-code-inline',
                'block-code-block',
                'table',
                'link',
                'clear',
                'logger',
                'mode-toggle',
                'full-screen',
              ]}
              onImageUpload={onImageUpload}
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between">
            <div>
              <button
                type="button"
                onClick={togglePreview}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors mr-2"
              >
                Preview
              </button>
            </div>
            <div className="space-x-2">
              <button
                type="button"
                onClick={onCancel || (() => router.back())}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};