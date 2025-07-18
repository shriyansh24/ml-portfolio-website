import { useState, useEffect } from 'react';

interface PaperFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortOption: { sortBy: string; sortOrder: 'asc' | 'desc' }) => void;
  currentSort: { sortBy: string; sortOrder: 'asc' | 'desc' };
  onDateRangeChange?: (range: { startDate: string; endDate: string }) => void;
  onTopicChange?: (topic: string) => void;
  onSearchChange?: (searchTerm: string) => void;
  currentDateRange?: { startDate: string; endDate: string };
  currentTopic?: string;
  currentSearchTerm?: string;
  mlTopics?: string[];
}

export default function PaperFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onSortChange,
  currentSort,
  onDateRangeChange,
  onTopicChange,
  onSearchChange,
  currentDateRange = { startDate: '', endDate: '' },
  currentTopic = '',
  currentSearchTerm = '',
  mlTopics = ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Generative AI', 'Transformers', 'Neural Networks', 'Machine Learning']
}: PaperFiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(currentSearchTerm);
  const [startDate, setStartDate] = useState(currentDateRange.startDate);
  const [endDate, setEndDate] = useState(currentDateRange.endDate);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(currentSearchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (onSearchChange && debouncedSearchTerm !== currentSearchTerm) {
      onSearchChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearchChange, currentSearchTerm]);

  const sortOptions = [
    { label: 'Publication Date (Newest)', value: { sortBy: 'publicationDate', sortOrder: 'desc' as const } },
    { label: 'Publication Date (Oldest)', value: { sortBy: 'publicationDate', sortOrder: 'asc' as const } },
    { label: 'Relevance (Highest)', value: { sortBy: 'relevanceScore', sortOrder: 'desc' as const } },
    { label: 'Relevance (Lowest)', value: { sortBy: 'relevanceScore', sortOrder: 'asc' as const } },
    { label: 'Title (A-Z)', value: { sortBy: 'title', sortOrder: 'asc' as const } },
    { label: 'Title (Z-A)', value: { sortBy: 'title', sortOrder: 'desc' as const } },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(
      (opt) => opt.value.sortBy === currentSort.sortBy && opt.value.sortOrder === currentSort.sortOrder
    );
    return option?.label || 'Sort by';
  };

  const handleDateRangeApply = () => {
    if (onDateRangeChange) {
      onDateRangeChange({ startDate, endDate });
    }
  };

  const handleClearFilters = () => {
    if (onCategoryChange) onCategoryChange('');
    if (onTopicChange) onTopicChange('');
    if (onDateRangeChange) onDateRangeChange({ startDate: '', endDate: '' });
    if (onSearchChange) {
      onSearchChange('');
      setSearchTerm('');
    }
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="w-full border border-border rounded-lg p-4 mb-6">
      {/* Search bar */}
      {onSearchChange && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search papers by title, author, or abstract..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-border rounded-md"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {searchTerm ? (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    if (onSearchChange) onSearchChange('');
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Basic filters row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === '' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            All
          </button>
          
          {categories.slice(0, isFilterExpanded ? categories.length : 5).map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
          
          {categories.length > 5 && (
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="px-3 py-1 rounded-full text-sm bg-muted hover:bg-muted/80"
            >
              {isFilterExpanded ? 'Show Less' : `+${categories.length - 5} More`}
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsTopicOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded"
            >
              <span>{getCurrentSortLabel()}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {isSortOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-background border border-border rounded-md shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={`${option.value.sortBy}-${option.value.sortOrder}`}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-muted ${
                      currentSort.sortBy === option.value.sortBy && currentSort.sortOrder === option.value.sortOrder
                        ? 'bg-muted/50'
                        : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ML/AI Topics dropdown */}
          {onTopicChange && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsTopicOpen(!isTopicOpen);
                  setIsSortOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 border border-border rounded ${
                  currentTopic ? 'bg-primary/10' : ''
                }`}
              >
                <span>{currentTopic || 'ML/AI Topics'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${isTopicOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {isTopicOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-background border border-border rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      onTopicChange('');
                      setIsTopicOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-muted ${
                      currentTopic === '' ? 'bg-muted/50' : ''
                    }`}
                  >
                    All Topics
                  </button>
                  {mlTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        onTopicChange(topic);
                        setIsTopicOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-muted ${
                        currentTopic === topic ? 'bg-muted/50' : ''
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {onDateRangeChange && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                From Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                To Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDateRangeApply}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {(selectedCategory || currentTopic || currentDateRange.startDate || currentDateRange.endDate || currentSearchTerm) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {selectedCategory && (
              <span className="bg-primary/10 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Category: {selectedCategory}
                <button 
                  onClick={() => onCategoryChange('')}
                  className="hover:text-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </span>
            )}
            
            {currentTopic && (
              <span className="bg-primary/10 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Topic: {currentTopic}
                <button 
                  onClick={() => onTopicChange && onTopicChange('')}
                  className="hover:text-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </span>
            )}
            
            {(currentDateRange.startDate || currentDateRange.endDate) && (
              <span className="bg-primary/10 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Date: {currentDateRange.startDate ? new Date(currentDateRange.startDate).toLocaleDateString() : 'Any'} 
                {' to '} 
                {currentDateRange.endDate ? new Date(currentDateRange.endDate).toLocaleDateString() : 'Any'}
                <button 
                  onClick={() => onDateRangeChange && onDateRangeChange({ startDate: '', endDate: '' })}
                  className="hover:text-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </span>
            )}
            
            {currentSearchTerm && (
              <span className="bg-primary/10 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Search: "{currentSearchTerm}"
                <button 
                  onClick={() => {
                    if (onSearchChange) {
                      onSearchChange('');
                      setSearchTerm('');
                    }
                  }}
                  className="hover:text-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}