/**
 * Database Setup
 * This file contains functions to initialize the database and ensure it's ready for use
 */

import { getDatabase } from './db';
import { blogPostSchema, researchPaperSchema, portfolioDataSchema, userSessionSchema } from './schemas';

/**
 * Initialize the database with all required collections and schema validation
 */
export async function setupDatabase() {
  try {
    console.log('Setting up database collections and schema validation...');
    const db = await getDatabase();
    
    // Get a list of existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Initialize blog posts collection
    if (!collectionNames.includes('blogPosts')) {
      await db.createCollection('blogPosts', blogPostSchema);
      // Create indexes for blog posts
      await db.collection('blogPosts').createIndex({ slug: 1 }, { unique: true });
      await db.collection('blogPosts').createIndex({ publishedAt: -1 });
      await db.collection('blogPosts').createIndex({ tags: 1 });
      // Create text index with apiStrict compatibility
      try {
        await db.collection('blogPosts').createIndex(
          { title: 'text', content: 'text', excerpt: 'text', tags: 'text' },
          { name: 'text_search' }
        );
      } catch (error: any) {
        if (error.code === 323) {
          // API strict error - create individual indexes instead
          console.log('Creating individual text indexes due to API strict mode');
          await db.collection('blogPosts').createIndex({ title: 1 });
          await db.collection('blogPosts').createIndex({ content: 1 });
          await db.collection('blogPosts').createIndex({ excerpt: 1 });
        } else {
          throw error;
        }
      }
      console.log('Created blogPosts collection with schema validation and indexes');
    } else {
      // Update validation schema for existing collection
      await db.command({
        collMod: 'blogPosts',
        validator: blogPostSchema.validator,
        validationLevel: 'moderate'
      });
      console.log('Updated blogPosts collection schema validation');
    }
    
    // Initialize research papers collection
    if (!collectionNames.includes('researchPapers')) {
      await db.createCollection('researchPapers', researchPaperSchema);
      // Create indexes for research papers
      await db.collection('researchPapers').createIndex({ publicationDate: -1 });
      await db.collection('researchPapers').createIndex({ categories: 1 });
      // Create text index with apiStrict compatibility
      try {
        await db.collection('researchPapers').createIndex({ 
          title: 'text', 
          abstract: 'text', 
          authors: 'text' 
        }, { 
          name: 'papers_text_search' 
        });
      } catch (error: any) {
        if (error.code === 323) {
          // API strict error - create individual indexes instead
          console.log('Creating individual text indexes for research papers due to API strict mode');
          await db.collection('researchPapers').createIndex({ title: 1 });
          await db.collection('researchPapers').createIndex({ abstract: 1 });
          await db.collection('researchPapers').createIndex({ authors: 1 });
        } else {
          throw error;
        }
      }
      console.log('Created researchPapers collection with schema validation and indexes');
    } else {
      // Update validation schema for existing collection
      await db.command({
        collMod: 'researchPapers',
        validator: researchPaperSchema.validator,
        validationLevel: 'moderate'
      });
      console.log('Updated researchPapers collection schema validation');
    }
    
    // Initialize portfolio data collection
    if (!collectionNames.includes('portfolioData')) {
      await db.createCollection('portfolioData', portfolioDataSchema);
      console.log('Created portfolioData collection with schema validation');
    } else {
      // Update validation schema for existing collection
      await db.command({
        collMod: 'portfolioData',
        validator: portfolioDataSchema.validator,
        validationLevel: 'moderate'
      });
      console.log('Updated portfolioData collection schema validation');
    }
    
    // Initialize user sessions collection
    if (!collectionNames.includes('userSessions')) {
      await db.createCollection('userSessions', userSessionSchema);
      // Create indexes for user sessions
      await db.collection('userSessions').createIndex({ email: 1 });
      await db.collection('userSessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      console.log('Created userSessions collection with schema validation and TTL index');
    } else {
      // Update validation schema for existing collection
      await db.command({
        collMod: 'userSessions',
        validator: userSessionSchema.validator,
        validationLevel: 'moderate'
      });
      console.log('Updated userSessions collection schema validation');
    }
    
    console.log('Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}