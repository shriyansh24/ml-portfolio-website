/**
 * Script to generate a sitemap.xml file
 * This script can be run manually or as part of the build process
 * 
 * Usage:
 * node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ml-portfolio';

// Base URL for the website
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ml-portfolio.example.com';

// Static routes with their change frequency and priority
const staticRoutes = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects', changefreq: 'monthly', priority: 0.8 },
  { url: '/blog', changefreq: 'weekly', priority: 0.9 },
  { url: '/research', changefreq: 'weekly', priority: 0.9 },
  { url: '/transformer', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'yearly', priority: 0.6 },
];

/**
 * Generate sitemap XML content
 * 
 * @param {Array} routes - Array of route objects with url, lastmod, changefreq, and priority
 * @returns {string} - XML content for sitemap
 */
function generateSitemapXml(routes) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach((route) => {
    xml += '  <url>\n';
    xml += `    <loc>${route.url}</loc>\n`;
    if (route.lastmod) {
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
    }
    if (route.changefreq) {
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    }
    if (route.priority) {
      xml += `    <priority>${route.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

/**
 * Format date as YYYY-MM-DD
 * 
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Main function to generate sitemap
 */
async function main() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Get all blog posts
    const blogPosts = await db.collection('blogPosts').find({}, {
      projection: { slug: 1, updatedAt: 1 }
    }).toArray();
    
    // Get all research papers
    const researchPapers = await db.collection('researchPapers').find({}, {
      projection: { id: 1, updatedAt: 1 }
    }).toArray();
    
    // Prepare routes array with static routes
    const routes = staticRoutes.map(route => ({
      url: `${baseUrl}${route.url}`,
      lastmod: formatDate(new Date()),
      changefreq: route.changefreq,
      priority: route.priority,
    }));
    
    // Add blog post routes
    blogPosts.forEach(post => {
      routes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updatedAt ? formatDate(new Date(post.updatedAt)) : formatDate(new Date()),
        changefreq: 'monthly',
        priority: 0.7,
      });
    });
    
    // Add research paper routes
    researchPapers.forEach(paper => {
      routes.push({
        url: `${baseUrl}/research/${paper.id}`,
        lastmod: paper.updatedAt ? formatDate(new Date(paper.updatedAt)) : formatDate(new Date()),
        changefreq: 'monthly',
        priority: 0.7,
      });
    });
    
    // Generate sitemap XML
    const xml = generateSitemapXml(routes);
    
    // Write sitemap.xml file
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(sitemapPath, xml);
    
    console.log(`Sitemap generated at ${sitemapPath}`);
    console.log(`Total URLs: ${routes.length}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  } finally {
    // Close MongoDB connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the main function
main().catch(console.error);