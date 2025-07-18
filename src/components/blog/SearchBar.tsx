'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar = ({
  placeholder = 'Search blog posts...',
  onSearch,
  className = '',
}: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update query when URL search param changes
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleSearch = (searchQuery: string) => {
    // Clear any pending timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout to avoid too many searches while typing
    searchTimeout.current = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // If no onSearch handler is provided, update the URL
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
          params.set('q', searchQuery);
        } else {
          params.delete('q');
        }
        router.push(`/blog?${params.toString()}`);
      }
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleClear = () => {
    setQuery('');
    handleSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center border rounded-md overflow-hidden transition-all ${
          isFocused ? 'border-primary ring-1 ring-primary/20' : 'border-border'
        }`}
      >
        <div className="pl-3 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 py-2 px-3 outline-none bg-transparent"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Search blog posts"
        />
        {query && (
          <button
            onClick={handleClear}
            className="pr-3 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};