import { useState, useEffect } from 'react';
import { ResearchPaper } from '@/types/models';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import PaperFilters from './PaperFilters';

interface PapersListProps {
  initialPapers?: ResearchPaper[];
  initialCategories?: string[];
  isAdmin?: boolean;
}

// Common ML/AI topics for filtering
const ML_TOPICS = [
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Reinforcement Learning',
  'Generative AI',
  'Transformers',
  'Neural Networks',
  'Machine Learning',
  'AI Ethics',
  'Multimodal Learning'
];

export default function PapersList({ initialPapers, initialCategories, isAdmin = false }: PapersListProps) {
  const [papers, setPapers] = useState<ResearchPaper[]>(initialPapers || []);
  const [categories, setCategories] = useState<string[]>(initialCategories || []);
  const [loading, setLoading] = useState(!initialPapers);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({ startDate: '', endDate: '' });
  const [sortBy, setSortBy] = useState<string>('publicationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch papers if not provided initially
  useEffect(() => {
    if (!initialPapers) {
      fetchPapers();
    }
    
    if (!initialCategories) {
      fetchCategories();
    }
  }, [initialPapers, initialCategories]);

  // Fetch papers when filters change
  useEffect(() => {
    if (initialPapers && !hasActiveFilters()) {
      setPapers(initialPapers);
    } else {
      fetchPapers();
    }
  }, [selectedCategory, selectedTopic, searchTerm, dateRange, sortBy, sortOrder, currentPage]);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      selectedCategory !== '' || 
      selectedTopic !== '' || 
      searchTerm !== '' || 
      dateRange.startDate !== '' || 
      dateRange.endDate !== ''
    );
  };

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const limit = 10;
      const skip = (currentPage - 1) * limit;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString(),
        sortBy,
        sortOrder,
      });
      
      if (selectedCategory) {
        queryParams.append('category', selectedCategory);
      }
      
      if (selectedTopic) {
        queryParams.append('topic', selectedTopic);
      }
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      if (dateRange.startDate) {
        queryParams.append('startDate', dateRange.startDate);
      }
      
      if (dateRange.endDate) {
        queryParams.append('endDate', dateRange.endDate);
      }
      
      const response = await fetch(`/api/papers?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setPapers(data.papers);
        setTotalPages(data.totalPages);
      } else {
        console.error('Error fetching papers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/papers/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error('Error fetching categories:', data.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: { startDate: string; endDate: string }) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleSortChange = (sortOption: { sortBy: string; sortOrder: 'asc' | 'desc' }) => {
    setSortBy(sortOption.sortBy);
    setSortOrder(sortOption.sortOrder);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle paper sharing
  const handleSharePaper = async (paper: ResearchPaper) => {
    try {
      const shareUrl = `${window.location.origin}/research/${paper.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: paper.title,
          text: `Check out this research paper: ${paper.title}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing paper:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PaperFilters 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        currentSort={{ sortBy, sortOrder }}
        onTopicChange={handleTopicChange}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        currentTopic={selectedTopic}
        currentSearchTerm={searchTerm}
        currentDateRange={dateRange}
        mlTopics={ML_TOPICS}
      />
      
      {papers.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-lg text-muted-foreground">No research papers found matching your filters.</p>
          {hasActiveFilters() && (
            <button 
              onClick={() => {
                setSelectedCategory('');
                setSelectedTopic('');
                setSearchTerm('');
                setDateRange({ startDate: '', endDate: '' });
              }}
              className="mt-4 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8 mt-6">
          {papers.map((paper) => (
            <div key={paper.id} className="border border-border rounded-lg p-6 hover:border-primary/30 transition-colors">
              <h2 className="text-xl font-bold mb-2">{paper.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Authors: {paper.authors.join(', ')} • Published: {formatDate(paper.publicationDate)} • 
                {paper.venue && ` Venue: ${paper.venue}`}
              </p>
              <p className="mb-4 line-clamp-3">{paper.abstract}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {paper.categories.map((category) => (
                  <span 
                    key={category} 
                    className="bg-muted text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-muted/80"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link 
                  href={`/research/${paper.id}`} 
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  View details
                </Link>
                
                {paper.doi && (
                  <a 
                    href={`https://doi.org/${paper.doi}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:underline flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    DOI
                  </a>
                )}
                
                {paper.arxivId && (
                  <a 
                    href={`https://arxiv.org/abs/${paper.arxivId}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:underline flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    arXiv
                  </a>
                )}
                
                {paper.pdfUrl && (
                  <a 
                    href={paper.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:underline flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    PDF
                  </a>
                )}
                
                <button
                  onClick={() => handleSharePaper(paper)}
                  className="text-muted-foreground hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share
                </button>
                
                {isAdmin && (
                  <Link 
                    href={`/admin/research/edit/${paper.id}`} 
                    className="text-blue-500 hover:underline ml-auto flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-border disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-1">...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 rounded border border-border"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-border disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}