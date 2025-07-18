/**
 * Database Initialization
 * This file contains functions to initialize the database with proper collections and schema validation
 */

import { getDatabase } from './db';
import { blogPostSchema, researchPaperSchema, portfolioDataSchema, userSessionSchema } from './schemas';
import { mediaFileSchema } from './mediaSchema';

/**
 * Initialize the database with all required collections and schema validation
 */
export async function initializeDatabase() {
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
    await db.collection('researchPapers').createIndex({ 
      title: 'text', 
      abstract: 'text', 
      authors: 'text' 
    }, { 
      name: 'papers_text_search' 
    });
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
  
  // Initialize media files collection
  if (!collectionNames.includes('mediaFiles')) {
    await db.createCollection('mediaFiles', mediaFileSchema);
    // Create indexes for media files
    await db.collection('mediaFiles').createIndex({ uploadedAt: -1 });
    await db.collection('mediaFiles').createIndex({ category: 1 });
    await db.collection('mediaFiles').createIndex({ contentType: 1 });
    await db.collection('mediaFiles').createIndex({ 
      filename: 'text', 
      alt: 'text', 
      caption: 'text',
      tags: 'text'
    }, { 
      name: 'media_text_search' 
    });
    console.log('Created mediaFiles collection with schema validation and indexes');
  } else {
    // Update validation schema for existing collection
    await db.command({
      collMod: 'mediaFiles',
      validator: mediaFileSchema.validator,
      validationLevel: 'moderate'
    });
    console.log('Updated mediaFiles collection schema validation');
  }
  
  return {
    blogPosts: db.collection('blogPosts'),
    researchPapers: db.collection('researchPapers'),
    portfolioData: db.collection('portfolioData'),
    userSessions: db.collection('userSessions'),
    mediaFiles: db.collection('mediaFiles')
  };
}