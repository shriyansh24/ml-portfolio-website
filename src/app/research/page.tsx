import Layout from "@/components/layout/Layout";
import { generateMetadata } from "@/components/SEOHead";
import PapersList from "@/components/research/PapersList";
import { ResearchPapersDB } from "@/lib/dbUtils";
import { getCollection } from "@/lib/db";

export const metadata = generateMetadata({
  title: "Research Papers | ML Portfolio",
  description: "Curated collection of research papers on machine learning, AI, and transformer models",
  keywords: ["research", "papers", "machine learning", "AI", "transformer", "LLM", "academic"],
});

export const revalidate = 3600; // Revalidate every hour

async function getCategories() {
  try {
    const collection = await getCollection('researchPapers');
    
    // Aggregate to get unique categories
    const categoriesResult = await collection.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories' } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    return categoriesResult.map(item => item._id);
  } catch (error) {
    console.error('Error fetching paper categories:', error);
    return [];
  }
}

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get query parameters
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'publicationDate';
  const sortOrder = typeof searchParams.sortOrder === 'string' ? 
    (searchParams.sortOrder === 'asc' ? 'asc' : 'desc') : 'desc';
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  
  // Fetch papers with filters
  const limit = 10;
  const skip = (page - 1) * limit;
  const options = { limit, skip, sortBy, sortOrder };
  if (category) Object.assign(options, { category });
  
  const { papers, total, totalPages } = await ResearchPapersDB.getAll(options);
  const categories = await getCategories();
  
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Research Papers</h1>
        <p className="text-lg text-muted-foreground mb-12">
          A curated collection of important research papers in machine learning and AI with my annotations.
        </p>
        
        <PapersList 
          initialPapers={papers} 
          initialCategories={categories}
        />
      </div>
    </Layout>
  );
}