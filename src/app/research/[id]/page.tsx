import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/dbUtils';
import PaperDetail from '@/components/research/PaperDetail';
import { generateMetadata } from '@/components/SEOHead';
import StructuredData, { generateBreadcrumbData } from '@/components/SEOStructuredData';

// Define params type for generateStaticParams
type Params = {
  id: string;
};

// Generate static params for all research papers at build time
export async function generateStaticParams() {
  try {
    const { db } = await connectToDatabase();
    const papers = await db.collection('researchPapers').find({}, { projection: { id: 1 } }).toArray();
    
    return papers.map((paper) => ({
      id: paper.id,
    }));
  } catch (error) {
    console.error('Error generating static params for research papers:', error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const { db } = await connectToDatabase();
    const paper = await db.collection('researchPapers').findOne({ id: params.id });
    
    if (!paper) {
      return generateMetadata({
        title: 'Research Paper Not Found',
        description: 'The requested research paper could not be found.',
        noIndex: true,
      });
    }
    
    return generateMetadata({
      title: paper.title,
      description: paper.abstract ? `${paper.abstract.substring(0, 160)}...` : 'Research paper details',
      ogUrl: `/research/${paper.id}`,
      ogType: 'article',
      author: paper.authors?.join(', ') || 'Various Authors',
      publishedTime: paper.publicationDate,
      tags: paper.categories,
      schemaType: 'ScholarlyArticle',
      datePublished: paper.publicationDate,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Research', url: '/research' },
        { name: paper.title, url: `/research/${paper.id}` },
      ],
    });
  } catch (error) {
    console.error('Error generating metadata for research paper:', error);
    return generateMetadata({
      title: 'Research Paper',
      description: 'ML Portfolio research paper details',
    });
  }
}

// Research paper detail page component
export default async function ResearchPaperPage({ params }: { params: Params }) {
  try {
    const { db } = await connectToDatabase();
    const paper = await db.collection('researchPapers').findOne({ id: params.id });
    
    if (!paper) {
      notFound();
    }
    
    // Generate structured data for the scholarly article
    const articleData = {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "headline": paper.title,
      "author": paper.authors?.map((author: string) => ({
        "@type": "Person",
        "name": author,
      })) || [],
      "datePublished": paper.publicationDate,
      "description": paper.abstract,
      "publisher": {
        "@type": "Organization",
        "name": paper.venue,
      },
      ...(paper.doi && { "sameAs": `https://doi.org/${paper.doi}` }),
      ...(paper.arxivId && { "sameAs": `https://arxiv.org/abs/${paper.arxivId}` }),
      "keywords": paper.categories?.join(", "),
    };
    
    // Generate breadcrumb structured data
    const breadcrumbData = generateBreadcrumbData([
      { name: 'Home', url: '/' },
      { name: 'Research', url: '/research' },
      { name: paper.title, url: `/research/${paper.id}` },
    ]);
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Add structured data */}
        <StructuredData data={articleData} />
        <StructuredData data={breadcrumbData} />
        
        {/* Render paper details */}
        <PaperDetail paper={paper} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching research paper:', error);
    notFound();
  }
}

// Set revalidation time for incremental static regeneration (ISR)
export const revalidate = 3600; // Revalidate every hour