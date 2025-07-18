import { MetadataRoute } from 'next';

/**
 * Generate a robots.txt file for the website
 * This function runs at build time and generates a robots.txt file
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ml-portfolio.example.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login/', '/unauthorized/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}