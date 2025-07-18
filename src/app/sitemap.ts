import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/dbUtils';

/**
 * Generate a sitemap for the website
 * This function runs at build time and generates a sitemap.xml file
 * It includes all static routes and dynamic routes from the database
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ml-portfolio.example.com';
  
  // Define static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/transformer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ] as MetadataRoute.Sitemap;

  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Get all blog posts
    const blogPosts = await db.collection('blogPosts').find({}, {
      projection: { slug: 1, updatedAt: 1 }
    }).toArray();
    
    // Get all research papers
    const researchPapers = await db.collection('researchPapers').find({}, {
      projection: { id: 1, updatedAt: 1 }
    }).toArray();
    
    // Add blog posts to sitemap
    const blogRoutes = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    
    // Add research papers to sitemap
    const researchRoutes = researchPapers.map((paper) => ({
      url: `${baseUrl}/research/${paper.id}`,
      lastModified: paper.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    
    // Combine all routes
    return [...staticRoutes, ...blogRoutes, ...researchRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return only static routes if there's an error
    return staticRoutes;
  }
}