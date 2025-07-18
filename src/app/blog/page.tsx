import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/dbUtils';
import BlogList from '@/components/blog/BlogList';
import SearchBar from '@/components/blog/SearchBar';
import TagCloud from '@/components/blog/TagCloud';
import { generateMetadata } from '@/components/SEOHead';
import StructuredData, { generateBreadcrumbData } from '@/components/SEOStructuredData';

// Number of posts per page
const POSTS_PER_PAGE = 9;

// Generate metadata for the page
export const metadata: Metadata = generateMetadata({
  title: 'Blog | ML Portfolio',
  description: 'Explore articles on machine learning, artificial intelligence, and deep learning topics.',
  ogUrl: '/blog',
  ogType: 'website',
  schemaType: 'WebSite',
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ],
});

// Blog listing page component
export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; tag?: string; search?: string };
}) {
  // Get page number from query params or default to 1
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const tag = searchParams.tag || '';
  const search = searchParams.search || '';
  
  try {
    const { db } = await connectToDatabase();
    
    // Build query based on filters
    const query: any = {};
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      query.$text = { $search: search };
    }
    
    // Get total count for pagination
    const totalPosts = await db.collection('blogPosts').countDocuments(query);
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    
    // Get posts for current page
    const posts = await db.collection('blogPosts')
      .find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .toArray();
    
    // Get all tags for tag cloud
    const tags = await db.collection('blogPosts').aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]).toArray();
    
    // Generate breadcrumb structured data
    const breadcrumbData = generateBreadcrumbData([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
    ]);
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Add structured data */}
        <StructuredData data={breadcrumbData} />
        
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with search and tags */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SearchBar initialQuery={search} />
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                <TagCloud 
                  tags={tags.map(tag => ({ name: tag._id, count: tag.count }))} 
                  activeTag={tag} 
                />
              </div>
            </div>
          </div>
          
          {/* Main content with blog posts */}
          <div className="lg:col-span-3">
            <BlogList 
              posts={posts} 
              currentPage={page} 
              totalPages={totalPages} 
              tag={tag}
              search={search}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p>Error loading blog posts. Please try again later.</p>
      </div>
    );
  }
}

// Set revalidation time for incremental static regeneration (ISR)
export const revalidate = 3600; // Revalidate every hour