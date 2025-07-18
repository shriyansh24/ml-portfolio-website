import { useState } from 'react';
import { ResearchPaper } from '@/types/models';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface PaperDetailProps {
  paper: ResearchPaper;
  isAdmin?: boolean;
  relatedPapers?: ResearchPaper[];
}

export default function PaperDetail({ paper, isAdmin = false, relatedPapers = [] }: PaperDetailProps) {
  const [shareSuccess, setShareSuccess] = useState(false);
  
  if (!paper) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Paper not found.</p>
      </div>
    );
  }

  // Handle paper sharing
  const handleShare = async () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
      
      if (navigator.share) {
        await navigator.share({
          title: paper.title,
          text: `Check out this research paper: ${paper.title}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing paper:', err);
    }
  };

  // Calculate relevance indicator class based on score
  const getRelevanceClass = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-4">{paper.title}</h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors"
              aria-label="Share paper"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              {shareSuccess ? 'Copied!' : 'Share'}
            </button>
            
            {isAdmin && (
              <Link 
                href={`/admin/research/edit/${paper.id}`} 
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
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
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
          <div>
            <strong>Authors:</strong> {paper.authors.join(', ')}
          </div>
          <div>
            <strong>Published:</strong> {formatDate(paper.publicationDate)}
          </div>
          {paper.venue && (
            <div>
              <strong>Venue:</strong> {paper.venue}
            </div>
          )}
          <div className={`px-2 py-0.5 rounded-full text-xs ${getRelevanceClass(paper.relevanceScore)}`}>
            Relevance: {paper.relevanceScore}/10
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {paper.categories.map((category) => (
            <Link 
              key={category} 
              href={`/research?category=${encodeURIComponent(category)}`}
              className="bg-muted text-xs px-2 py-1 rounded-full hover:bg-muted/80"
            >
              {category}
            </Link>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8 border-t border-b border-border py-4">
          {paper.doi && (
            <a 
              href={`https://doi.org/${paper.doi}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              DOI: {paper.doi}
            </a>
          )}
          
          {paper.arxivId && (
            <a 
              href={`https://arxiv.org/abs/${paper.arxivId}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              arXiv: {paper.arxivId}
            </a>
          )}
          
          {paper.pdfUrl && (
            <a 
              href={paper.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              PDF
            </a>
          )}
          
          {/* Google Scholar search link */}
          <a 
            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Google Scholar
          </a>
          
          {/* Semantic Scholar search link */}
          <a 
            href={`https://www.semanticscholar.org/search?q=${encodeURIComponent(paper.title)}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Semantic Scholar
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Abstract</h2>
            <div className="prose max-w-none">
              <p>{paper.abstract}</p>
            </div>
          </div>
          
          {paper.keyFindings && paper.keyFindings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Key Findings</h2>
              <ul className="list-disc pl-5 space-y-2">
                {paper.keyFindings.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div>
          {paper.personalAnnotations && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">My Annotations</h2>
              <div className="prose max-w-none bg-muted/30 p-4 rounded-md">
                <p>{paper.personalAnnotations}</p>
              </div>
            </div>
          )}
          
          {relatedPapers.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Related Papers</h2>
              <div className="space-y-4">
                {relatedPapers.map(relatedPaper => (
                  <div key={relatedPaper.id} className="border border-border rounded-md p-3">
                    <Link href={`/research/${relatedPaper.id}`} className="font-medium hover:text-primary">
                      {relatedPaper.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {relatedPaper.authors.join(', ')} • {formatDate(relatedPaper.publicationDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/research" className="text-primary hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Research Papers
        </Link>
      </div>
    </article>
  );
}