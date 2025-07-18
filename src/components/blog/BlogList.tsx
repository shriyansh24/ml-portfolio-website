'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BlogPost } from '@/types/models';
import { SearchBar } from './SearchBar';
import { TagCloud } from './TagCloud';
import Fuse from 'fuse.js';
import { createBlogSearchIndex } from '@/lib/searchUtils';

interface BlogListProps {
  initialPosts?: BlogPost[];
  postsPerPage?: number;
}

export const BlogList = ({ initialPosts = [], postsPerPage = 6 }: BlogListProps) => {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(!initialPosts.length);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [searchIndex, setSearchIndex] = useState<Fuse<BlogPost> | null>(null);
  
  // Get search query and tag from URL
  const searchQuery = searchParams.get('q') || '';
  const tagFilter = searchParams.get('tag') || '';

  useEffect(() => {
    if (initialPosts.length) {
      // If posts are provided as props, use them
      setPosts(initialPosts);
      setAllPosts(initialPosts);
      setSearchIndex(createBlogSearchIndex(initialPosts));
      setLoading(false);
    } else {
      // Otherwise fetch from API
      fetchPosts();
    }
  }, [initialPosts]);
  
  useEffect(() => {
    // Handle search and filtering when URL params change
    if (searchIndex && allPosts.length > 0) {
      let filteredPosts = [...allPosts];
      
      // Apply tag filter if present
      if (tagFilter) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags.includes(tagFilter)
        );
      }
      
      // Apply search if query present
      if (searchQuery && searchIndex) {
        const searchResults = searchIndex.search(searchQuery);
        filteredPosts = searchResults.map(result => result.item);
      }
      
      // Update posts and pagination
      const totalFilteredPosts = filteredPosts.length;
      const paginatedPosts = filteredPosts.slice(
        (page - 1) * postsPerPage, 
        page * postsPerPage
      );
      
      setPosts(paginatedPosts);
      setTotalPosts(totalFilteredPosts);
      setTotalPages(Math.ceil(totalFilteredPosts / postsPerPage));
    } else if (!searchQuery && !tagFilter && allPosts.length > 0) {
      // If no filters, fetch from API with pagination
      fetchPosts();
    }
  }, [searchQuery, tagFilter, page, searchIndex, allPosts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If we have search query, use search endpoint
      const endpoint = searchQuery 
        ? `/api/blog/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${postsPerPage}`
        : `/api/blog?page=${page}&limit=${postsPerPage}${tagFilter ? `&tag=${encodeURIComponent(tagFilter)}` : ''}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setTotalPosts(data.total);
      setLoading(false);
      
      // If we don't have all posts yet, fetch them for client-side search
      if (allPosts.length === 0) {
        fetchAllPosts();
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
      setLoading(false);
    }
  };
  
  const fetchAllPosts = async () => {
    try {
      // Fetch all posts for client-side search (limit to 100 for performance)
      const response = await fetch('/api/blog?limit=100');
      
      if (!response.ok) {
        throw new Error('Failed to fetch all blog posts');
      }
      
      const data = await response.json();
      setAllPosts(data.posts);
      setSearchIndex(createBlogSearchIndex(data.posts));
    } catch (err) {
      console.error('Error fetching all blog posts:', err);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          onClick={fetchPosts}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-lg text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <SearchBar 
          className="w-full max-w-xl" 
          placeholder="Search blog posts..."
        />
        
        <TagCloud 
          initialPosts={allPosts} 
          className="mt-4"
        />
        
        {searchQuery && (
          <div className="mt-4">
            <p className="text-muted-foreground">
              {totalPosts} {totalPosts === 1 ? 'result' : 'results'} found for "{searchQuery}"
            </p>
          </div>
        )}
        
        {tagFilter && !searchQuery && (
          <div className="mt-4">
            <p className="text-muted-foreground">
              Showing posts tagged with "{tagFilter}"
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="h-48 bg-muted flex items-center justify-center">
              {post.featured && (
                <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h2 className="text-xl font-bold mb-2 line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-muted-foreground mb-2">
                {formatDate(post.publishedAt)}
              </p>
              <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Link 
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <Link 
                href={`/blog/${post.slug}`} 
                className="text-primary hover:underline mt-auto"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              &larr;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-md ${
                  pageNum === page
                    ? 'bg-primary text-white'
                    : 'border border-border hover:bg-muted'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              &rarr;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};