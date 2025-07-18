'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResearchPaper } from '@/types/models';
import MediaSelector from '../media/MediaSelector';

interface PaperEditorProps {
  paper?: ResearchPaper;
  isEdit?: boolean;
}

// Common ML/AI research areas and topics for suggestions
const COMMON_CATEGORIES = [
  'Machine Learning',
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Reinforcement Learning',
  'Generative AI',
  'Neural Networks',
  'Transformers',
  'Large Language Models',
  'Multimodal Learning',
  'AI Ethics',
  'Explainable AI',
  'Robotics',
  'Time Series Analysis',
  'Graph Neural Networks',
  'Federated Learning',
  'Self-Supervised Learning',
  'Few-Shot Learning',
  'Meta Learning',
  'Optimization'
];

// Common academic venues for suggestions
const COMMON_VENUES = [
  'NeurIPS',
  'ICML',
  'ICLR',
  'ACL',
  'EMNLP',
  'CVPR',
  'ECCV',
  'ICCV',
  'AAAI',
  'IJCAI',
  'KDD',
  'WWW',
  'SIGIR',
  'JMLR',
  'IEEE Transactions on Pattern Analysis and Machine Intelligence',
  'Computational Linguistics',
  'arXiv preprint'
];

export default function PaperEditor({ paper, isEdit = false }: PaperEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'annotations'>('basic');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [filteredCategorySuggestions, setFilteredCategorySuggestions] = useState<string[]>([]);
  const [filteredVenueSuggestions, setFilteredVenueSuggestions] = useState<string[]>([]);
  
  // Form state
  const [title, setTitle] = useState(paper?.title || '');
  const [authors, setAuthors] = useState<string[]>(paper?.authors || ['']);
  const [abstract, setAbstract] = useState(paper?.abstract || '');
  const [publicationDate, setPublicationDate] = useState(
    paper?.publicationDate ? new Date(paper.publicationDate).toISOString().split('T')[0] : ''
  );
  const [venue, setVenue] = useState(paper?.venue || '');
  const [doi, setDoi] = useState(paper?.doi || '');
  const [arxivId, setArxivId] = useState(paper?.arxivId || '');
  const [pdfUrl, setPdfUrl] = useState(paper?.pdfUrl || '');
  const [categories, setCategories] = useState<string[]>(paper?.categories || ['']);
  const [personalAnnotations, setPersonalAnnotations] = useState(paper?.personalAnnotations || '');
  const [keyFindings, setKeyFindings] = useState<string[]>(paper?.keyFindings || ['']);
  const [relevanceScore, setRelevanceScore] = useState(paper?.relevanceScore || 5);
  const [shareUrl, setShareUrl] = useState('');
  
  // Update filtered suggestions when category input changes
  useEffect(() => {
    if (categoryInput) {
      const filtered = COMMON_CATEGORIES.filter(cat => 
        cat.toLowerCase().includes(categoryInput.toLowerCase()) && 
        !categories.includes(cat)
      );
      setFilteredCategorySuggestions(filtered);
    } else {
      setFilteredCategorySuggestions([]);
    }
  }, [categoryInput, categories]);

  // Update filtered venue suggestions when venue input changes
  useEffect(() => {
    if (venue) {
      const filtered = COMMON_VENUES.filter(v => 
        v.toLowerCase().includes(venue.toLowerCase())
      ).slice(0, 5);
      setFilteredVenueSuggestions(filtered);
    } else {
      setFilteredVenueSuggestions([]);
    }
  }, [venue]);

  // Generate share URL for existing papers
  useEffect(() => {
    if (isEdit && paper?.id) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setShareUrl(`${baseUrl}/research/${paper.id}`);
    }
  }, [isEdit, paper]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate required fields
      if (!title || !authors.filter(Boolean).length || !abstract || !publicationDate || !venue || !categories.filter(Boolean).length) {
        throw new Error('Please fill in all required fields');
      }
      
      // Filter out empty values
      const filteredAuthors = authors.filter(Boolean);
      const filteredCategories = categories.filter(Boolean);
      const filteredKeyFindings = keyFindings.filter(Boolean);
      
      const paperData = {
        title,
        authors: filteredAuthors,
        abstract,
        publicationDate,
        venue,
        doi: doi || undefined,
        arxivId: arxivId || undefined,
        pdfUrl: pdfUrl || undefined,
        categories: filteredCategories,
        personalAnnotations,
        keyFindings: filteredKeyFindings,
        relevanceScore
      };
      
      let response;
      
      if (isEdit && paper?.id) {
        // Update existing paper
        response = await fetch(`/api/papers/${paper.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paperData)
        });
      } else {
        // Create new paper
        response = await fetch('/api/papers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paperData)
        });
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save research paper');
      }
      
      setSuccess(isEdit ? 'Research paper updated successfully!' : 'Research paper created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        if (isEdit) {
          router.push(`/research/${paper.id}`);
        } else {
          router.push(`/research/${data.paper.id}`);
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle array field changes
  const handleArrayChange = (
    index: number,
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };
  
  // Add new item to array
  const addArrayItem = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray([...array, '']);
  };
  
  // Remove item from array
  const removeArrayItem = (
    index: number,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (array.length <= 1) return;
    const newArray = array.filter((_, i) => i !== index);
    setArray(newArray);
  };
  
  // Handle delete paper
  const handleDelete = async () => {
    if (!paper?.id || !isEdit) return;
    
    if (!confirm('Are you sure you want to delete this research paper? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/papers/${paper.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete research paper');
      }
      
      setSuccess('Research paper deleted successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/research');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle category suggestion selection
  const handleCategorySuggestionSelect = (suggestion: string) => {
    const newCategories = [...categories];
    // Find the first empty category or add to the end
    const emptyIndex = newCategories.findIndex(cat => !cat);
    if (emptyIndex !== -1) {
      newCategories[emptyIndex] = suggestion;
    } else {
      newCategories.push(suggestion);
    }
    setCategories(newCategories);
    setCategoryInput('');
    setShowCategorySuggestions(false);
  };

  // Handle venue suggestion selection
  const handleVenueSuggestionSelect = (suggestion: string) => {
    setVenue(suggestion);
    setShowVenueSuggestions(false);
  };

  // Handle share functionality
  const handleShare = async () => {
    if (!shareUrl) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this research paper: ${title}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setSuccess('Link copied to clipboard!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Auto-fill from DOI or arXiv ID
  const handleAutoFill = async (source: 'doi' | 'arxiv') => {
    const id = source === 'doi' ? doi : arxivId;
    if (!id) {
      setError(`Please enter a valid ${source === 'doi' ? 'DOI' : 'arXiv ID'} first`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This would be implemented with a real API in production
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (source === 'doi') {
        // Simulated DOI lookup result
        setTitle('Attention Is All You Need');
        setAuthors(['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin']);
        setAbstract('The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely...');
        setVenue('NeurIPS');
        setPublicationDate('2017-06-12');
        setCategories(['Deep Learning', 'Natural Language Processing', 'Transformers']);
      } else {
        // Simulated arXiv lookup result
        setTitle('BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding');
        setAuthors(['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova']);
        setAbstract('We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers...');
        setVenue('NAACL');
        setPublicationDate('2018-10-11');
        setCategories(['Natural Language Processing', 'Transformers', 'Pre-training']);
      }
      
      setSuccess(`Paper details auto-filled from ${source === 'doi' ? 'DOI' : 'arXiv'}`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(`Failed to retrieve paper details from ${source === 'doi' ? 'DOI' : 'arXiv'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? 'Edit Research Paper' : 'Add New Research Paper'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'basic'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Basic Information
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'details'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Details & Links
        </button>
        <button
          onClick={() => setActiveTab('annotations')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'annotations'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Annotations & Findings
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
                required
              />
            </div>
            
            {/* Authors */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Authors <span className="text-red-500">*</span>
              </label>
              {authors.map((author, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => handleArrayChange(index, e.target.value, authors, setAuthors)}
                    className="flex-1 px-3 py-2 border border-border rounded-md"
                    placeholder={`Author ${index + 1}`}
                    required={index === 0}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, authors, setAuthors)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    disabled={authors.length <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(authors, setAuthors)}
                className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Author
              </button>
            </div>
            
            {/* Abstract */}
            <div>
              <label htmlFor="abstract" className="block text-sm font-medium mb-1">
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                id="abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md h-32"
                required
              />
            </div>
            
            {/* Publication Date */}
            <div>
              <label htmlFor="publicationDate" className="block text-sm font-medium mb-1">
                Publication Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="publicationDate"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
                required
              />
            </div>
            
            {/* Venue with suggestions */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium mb-1">
                Venue (Journal/Conference) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="venue"
                  value={venue}
                  onChange={(e) => {
                    setVenue(e.target.value);
                    setShowVenueSuggestions(true);
                  }}
                  onFocus={() => setShowVenueSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowVenueSuggestions(false), 200)}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  required
                />
                {showVenueSuggestions && filteredVenueSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredVenueSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleVenueSuggestionSelect(suggestion)}
                        className="block w-full text-left px-4 py-2 hover:bg-muted"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Categories with suggestions */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  Categories <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => {
                      setCategoryInput(e.target.value);
                      setShowCategorySuggestions(true);
                    }}
                    onFocus={() => setShowCategorySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                    placeholder="Search categories..."
                    className="px-3 py-1 text-sm border border-border rounded-md w-64"
                  />
                  {showCategorySuggestions && filteredCategorySuggestions.length > 0 && (
                    <div className="absolute z-10 right-0 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto w-64">
                      {filteredCategorySuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleCategorySuggestionSelect(suggestion)}
                          className="block w-full text-left px-4 py-2 hover:bg-muted"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.filter(Boolean).map((category, index) => (
                  <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-1">
                    <span>{category}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newCategories = [...categories];
                        newCategories[categories.indexOf(category)] = '';
                        setCategories(newCategories.filter(Boolean));
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {categories.some(cat => !cat) || categories.length === 0 ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={categories.find(cat => !cat) || ''}
                    onChange={(e) => {
                      const emptyIndex = categories.findIndex(cat => !cat);
                      if (emptyIndex !== -1) {
                        handleArrayChange(emptyIndex, e.target.value, categories, setCategories);
                      } else {
                        setCategories([...categories, e.target.value]);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-border rounded-md"
                    placeholder="Enter a category"
                    required={categories.length === 0}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem(categories, setCategories)}
                    className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => addArrayItem(categories, setCategories)}
                  className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Category
                </button>
              )}
            </div>
          </div>
        )}

        {/* Details & Links Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* DOI with auto-fill */}
            <div>
              <label htmlFor="doi" className="block text-sm font-medium mb-1">
                DOI
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="doi"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md"
                  placeholder="10.xxxx/xxxxx"
                />
                <button
                  type="button"
                  onClick={() => handleAutoFill('doi')}
                  disabled={!doi || loading}
                  className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter a DOI to automatically fetch paper details
              </p>
            </div>
            
            {/* arXiv ID with auto-fill */}
            <div>
              <label htmlFor="arxivId" className="block text-sm font-medium mb-1">
                arXiv ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="arxivId"
                  value={arxivId}
                  onChange={(e) => setArxivId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md"
                  placeholder="2101.xxxxx"
                />
                <button
                  type="button"
                  onClick={() => handleAutoFill('arxiv')}
                  disabled={!arxivId || loading}
                  className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter an arXiv ID to automatically fetch paper details
              </p>
            </div>
            
            {/* PDF URL with Media Selector */}
            <div>
              <label htmlFor="pdfUrl" className="block text-sm font-medium mb-1">
                PDF URL
              </label>
              <div className="space-y-2">
                <MediaSelector
                  value={pdfUrl}
                  onChange={setPdfUrl}
                  label=""
                  preview={false}
                />
                <p className="text-xs text-muted-foreground">
                  Select a PDF from the media library or enter a URL directly
                </p>
              </div>
            </div>
            
            {/* Relevance Score */}
            <div>
              <label htmlFor="relevanceScore" className="block text-sm font-medium mb-1">
                Relevance Score (1-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="relevanceScore"
                  min="1"
                  max="10"
                  value={relevanceScore}
                  onChange={(e) => setRelevanceScore(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-medium">{relevanceScore}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Rate how relevant this paper is to your research interests
              </p>
            </div>

            {/* Share options (for existing papers) */}
            {isEdit && paper?.id && (
              <div className="border border-border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Share Paper</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-muted"
                  />
                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    {navigator.share ? 'Share' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Annotations & Findings Tab */}
        {activeTab === 'annotations' && (
          <div className="space-y-6">
            {/* Personal Annotations */}
            <div>
              <label htmlFor="personalAnnotations" className="block text-sm font-medium mb-1">
                Personal Annotations
              </label>
              <textarea
                id="personalAnnotations"
                value={personalAnnotations}
                onChange={(e) => setPersonalAnnotations(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md h-32"
                placeholder="Your thoughts and annotations about this paper..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add your personal notes, insights, or critique of the paper
              </p>
            </div>
            
            {/* Key Findings */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Key Findings
              </label>
              {keyFindings.map((finding, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={finding}
                    onChange={(e) => handleArrayChange(index, e.target.value, keyFindings, setKeyFindings)}
                    className="flex-1 px-3 py-2 border border-border rounded-md"
                    placeholder={`Finding ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, keyFindings, setKeyFindings)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    disabled={keyFindings.length <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(keyFindings, setKeyFindings)}
                className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Finding
              </button>
              <p className="text-xs text-muted-foreground mt-1">
                List the key findings or contributions of the paper
              </p>
            </div>
          </div>
        )}
        
        {/* Submit Button - Always visible */}
        <div className="flex justify-between pt-4 border-t border-border mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Paper' : 'Add Paper'}
          </button>
          
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Delete Paper
            </button>
          )}
        </div>
      </form>
    </div>
  );
}