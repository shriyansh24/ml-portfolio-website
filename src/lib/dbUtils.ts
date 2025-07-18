/**
 * Database Utility Functions
 * This file contains utility functions for database CRUD operations
 */

import { ObjectId } from 'mongodb';
import { getCollection } from './db';
import { BlogPost, ResearchPaper, PortfolioData, UserSession, MediaFile } from '../types/models';

/**
 * Generic type for database models with MongoDB ObjectId
 */
type WithId<T> = T & { _id: ObjectId };

/**
 * Convert MongoDB document to application model
 * @param doc MongoDB document with _id
 * @returns Application model with string id
 */
function mapDocumentToModel<T>(doc: WithId<T>): T & { id: string } {
  if (!doc) return null;
  
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString()
  } as T & { id: string };
}

/**
 * Prepare model for database insertion by removing id field
 * @param model Application model with id
 * @returns Object ready for database insertion
 */
function prepareForInsert<T>(model: T & { id?: string }): Omit<T, 'id'> {
  const { id, ...rest } = model;
  return rest;
}

/**
 * Blog Post CRUD Operations
 */
export const BlogPostsDB = {
  /**
   * Get all blog posts with optional filtering and pagination
   */
  async getAll(options: {
    limit?: number;
    skip?: number;
    featured?: boolean;
    tag?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const {
      limit = 10,
      skip = 0,
      featured,
      tag,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = options;
    
    const collection = await getCollection('blogPosts');
    
    // Build query
    const query: Record<string, any> = {};
    if (featured !== undefined) query.featured = featured;
    if (tag) query.tags = tag;
    
    // Build sort
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1
    };
    
    const [posts, total] = await Promise.all([
      collection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);
    
    return {
      posts: posts.map(post => mapDocumentToModel<BlogPost>(post as WithId<BlogPost>)),
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  },
  
  /**
   * Get a blog post by ID
   */
  async getById(id: string) {
    try {
      const collection = await getCollection('blogPosts');
      const post = await collection.findOne({ _id: new ObjectId(id) });
      return post ? mapDocumentToModel<BlogPost>(post as WithId<BlogPost>) : null;
    } catch (error) {
      console.error('Error getting blog post by ID:', error);
      return null;
    }
  },
  
  /**
   * Get a blog post by slug
   */
  async getBySlug(slug: string) {
    const collection = await getCollection('blogPosts');
    const post = await collection.findOne({ slug });
    return post ? mapDocumentToModel<BlogPost>(post as WithId<BlogPost>) : null;
  },
  
  /**
   * Create a new blog post
   */
  async create(post: Omit<BlogPost, 'id'>) {
    const collection = await getCollection('blogPosts');
    
    // Ensure dates are Date objects
    const postToInsert = {
      ...post,
      publishedAt: new Date(post.publishedAt),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(postToInsert);
    return {
      ...post,
      id: result.insertedId.toString()
    };
  },
  
  /**
   * Update an existing blog post
   */
  async update(id: string, post: Partial<BlogPost>) {
    const collection = await getCollection('blogPosts');
    
    // Ensure updatedAt is set
    const updateData = {
      ...post,
      updatedAt: new Date()
    };
    
    // Convert dates if they exist
    if (updateData.publishedAt) {
      updateData.publishedAt = new Date(updateData.publishedAt);
    }
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return this.getById(id);
  },
  
  /**
   * Delete a blog post
   */
  async delete(id: string) {
    const collection = await getCollection('blogPosts');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
  
  /**
   * Search blog posts by text
   */
  async search(query: string, options: { limit?: number; skip?: number } = {}) {
    const { limit = 10, skip = 0 } = options;
    const collection = await getCollection('blogPosts');
    
    // Create text index if it doesn't exist
    const indexes = await collection.indexes();
    const hasTextIndex = indexes.some(index => index.name === 'text_search');
    
    if (!hasTextIndex) {
      await collection.createIndex(
        { title: 'text', content: 'text', excerpt: 'text', tags: 'text' },
        { name: 'text_search' }
      );
    }
    
    const [posts, total] = await Promise.all([
      collection
        .find({ $text: { $search: query } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ $text: { $search: query } })
    ]);
    
    return {
      posts: posts.map(post => mapDocumentToModel<BlogPost>(post as WithId<BlogPost>)),
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  }
};

/**
 * Research Papers CRUD Operations
 */
export const ResearchPapersDB = {
  /**
   * Get all research papers with optional filtering and pagination
   */
  async getAll(options: {
    limit?: number;
    skip?: number;
    category?: string;
    topic?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const {
      limit = 10,
      skip = 0,
      category,
      topic,
      search,
      startDate,
      endDate,
      sortBy = 'publicationDate',
      sortOrder = 'desc'
    } = options;
    
    const collection = await getCollection('researchPapers');
    
    // Build query
    const query: Record<string, any> = {};
    
    // Apply category filter
    if (category) query.categories = category;
    
    // Apply topic filter (search within categories)
    if (topic) {
      if (!query.categories) {
        query.categories = { $regex: new RegExp(topic, 'i') };
      } else {
        // If category is already specified, we need to use $and to combine filters
        query.$and = [
          { categories: query.categories },
          { categories: { $regex: new RegExp(topic, 'i') } }
        ];
        delete query.categories;
      }
    }
    
    // Apply date range filters
    if (startDate || endDate) {
      query.publicationDate = {};
      if (startDate) query.publicationDate.$gte = startDate;
      if (endDate) query.publicationDate.$lte = endDate;
    }
    
    // Apply text search
    if (search) {
      // Create text index if it doesn't exist
      const indexes = await collection.indexes();
      const hasTextIndex = indexes.some(index => index.name === 'papers_text_search');
      
      if (!hasTextIndex) {
        await collection.createIndex(
          { title: 'text', abstract: 'text', authors: 'text', venue: 'text', categories: 'text' },
          { name: 'papers_text_search' }
        );
      }
      
      // Use text search if available
      query.$text = { $search: search };
    }
    
    // Build sort
    let sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1
    };
    
    // If using text search, sort by relevance score first
    if (search) {
      sort = { 
        score: { $meta: 'textScore' },
        ...sort
      };
    }
    
    // Execute query
    const findOptions: any = {};
    if (search) {
      findOptions.projection = { score: { $meta: 'textScore' } };
    }
    
    const [papers, total] = await Promise.all([
      collection
        .find(query, findOptions)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);
    
    return {
      papers: papers.map(paper => mapDocumentToModel<ResearchPaper>(paper as WithId<ResearchPaper>)),
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  },
  
  /**
   * Get a research paper by ID
   */
  async getById(id: string) {
    try {
      const collection = await getCollection('researchPapers');
      const paper = await collection.findOne({ _id: new ObjectId(id) });
      return paper ? mapDocumentToModel<ResearchPaper>(paper as WithId<ResearchPaper>) : null;
    } catch (error) {
      console.error('Error getting research paper by ID:', error);
      return null;
    }
  },
  
  /**
   * Create a new research paper
   */
  async create(paper: Omit<ResearchPaper, 'id'>) {
    const collection = await getCollection('researchPapers');
    
    // Ensure dates are Date objects
    const paperToInsert = {
      ...paper,
      publicationDate: new Date(paper.publicationDate),
      addedAt: new Date()
    };
    
    const result = await collection.insertOne(paperToInsert);
    return {
      ...paper,
      id: result.insertedId.toString()
    };
  },
  
  /**
   * Update an existing research paper
   */
  async update(id: string, paper: Partial<ResearchPaper>) {
    const collection = await getCollection('researchPapers');
    
    // Convert dates if they exist
    const updateData = { ...paper };
    if (updateData.publicationDate) {
      updateData.publicationDate = new Date(updateData.publicationDate);
    }
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return this.getById(id);
  },
  
  /**
   * Delete a research paper
   */
  async delete(id: string) {
    const collection = await getCollection('researchPapers');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
  
  /**
   * Search research papers by text
   */
  async search(query: string, options: { limit?: number; skip?: number } = {}) {
    const { limit = 10, skip = 0 } = options;
    const collection = await getCollection('researchPapers');
    
    const [papers, total] = await Promise.all([
      collection
        .find({ $text: { $search: query } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ $text: { $search: query } })
    ]);
    
    return {
      papers: papers.map(paper => mapDocumentToModel<ResearchPaper>(paper as WithId<ResearchPaper>)),
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  }
};

/**
 * Portfolio Data CRUD Operations
 */
export const PortfolioDataDB = {
  /**
   * Get portfolio data (there should be only one document)
   */
  async get() {
    const collection = await getCollection('portfolioData');
    const data = await collection.findOne({});
    return data ? mapDocumentToModel<PortfolioData>(data as WithId<PortfolioData>) : null;
  },
  
  /**
   * Create or update portfolio data
   */
  async upsert(data: Partial<PortfolioData>) {
    const collection = await getCollection('portfolioData');
    
    // Process dates in experience and education
    if (data.experience) {
      data.experience = data.experience.map(exp => ({
        ...exp,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : undefined
      }));
    }
    
    if (data.education) {
      data.education = data.education.map(edu => ({
        ...edu,
        graduationDate: new Date(edu.graduationDate)
      }));
    }
    
    // Check if portfolio data exists
    const existing = await collection.findOne({});
    
    if (existing) {
      // Update existing document
      await collection.updateOne(
        { _id: existing._id },
        { $set: data }
      );
      return this.get();
    } else {
      // Create new document
      const result = await collection.insertOne(data as any);
      return {
        ...data,
        id: result.insertedId.toString()
      };
    }
  }
};

/**
 * Media Files CRUD Operations
 */
export const MediaFilesDB = {
  /**
   * Get all media files with optional filtering and pagination
   */
  async getAll(options: {
    limit?: number;
    skip?: number;
    category?: string;
    contentType?: string;
    tag?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const {
      limit = 50,
      skip = 0,
      category,
      contentType,
      tag,
      sortBy = 'uploadedAt',
      sortOrder = 'desc'
    } = options;
    
    const collection = await getCollection('mediaFiles');
    
    // Build query
    const query: Record<string, any> = {};
    if (category) query.category = category;
    if (contentType) query.contentType = { $regex: new RegExp(contentType, 'i') };
    if (tag) query.tags = tag;
    
    // Build sort
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1
    };
    
    const [files, total] = await Promise.all([
      collection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);
    
    return {
      files: files.map(file => mapDocumentToModel<MediaFile>(file as WithId<MediaFile>)),
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  },
  
  /**
   * Get a media file by ID
   */
  async getById(id: string) {
    try {
      const collection = await getCollection('mediaFiles');
      const file = await collection.findOne({ _id: new ObjectId(id) });
      return file ? mapDocumentToModel<MediaFile>(file as WithId<MediaFile>) : null;
    } catch (error) {
      console.error('Error getting media file by ID:', error);
      return null;
    }
  },
  
  /**
   * Create a new media file record
   */
  async create(file: Omit<MediaFile, 'id'>) {
    const collection = await getCollection('mediaFiles');
    
    // Ensure dates are Date objects
    const fileToInsert = {
      ...file,
      uploadedAt: new Date(file.uploadedAt)
    };
    
    const result = await collection.insertOne(fileToInsert);
    return {
      ...file,
      id: result.insertedId.toString()
    };
  },
  
  /**
   * Update an existing media file record
   */
  async update(id: string, file: Partial<MediaFile>) {
    const collection = await getCollection('mediaFiles');
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: file }
    );
    
    return this.getById(id);
  },
  
  /**
   * Delete a media file record
   */
  async delete(id: string) {
    const collection = await getCollection('mediaFiles');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
  
  /**
   * Search media files by text
   */
  async search(query: string, options: { limit?: number; skip?: number } = {}) {
    const { limit = 50, skip = 0 } = options;
    const collection = await getCollection('mediaFiles');
    
    // Create text index if it doesn't exist
    const indexes = await collection.indexes();
    const hasTextIndex = indexes.some(index => index.name === 'media_text_search');
    
    if (!hasTextIndex) {
      await collection.createIndex(
        { filename: 'text', alt: 'text', caption: 'text', tags: 'text', category: 'text' },
        { name: 'media_text_search' }
      );
    }
    
    const [files, total] = await Promise.all([
      collection
        .find({ $text: { $search: query } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments({ $text: { $search: query } })
    ]);
    
    return {
      files: files.map(file => mapDocumentToModel<MediaFile>(file as WithId<MediaFile>)),
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  }
};

/**
 * User Sessions CRUD Operations
 */
export const UserSessionsDB = {
  /**
   * Create a new user session
   */
  async create(session: Omit<UserSession, 'id'>) {
    const collection = await getCollection('userSessions');
    
    // Ensure dates are Date objects
    const sessionToInsert = {
      ...session,
      createdAt: new Date(),
      expiresAt: new Date(session.expiresAt),
      lastActivity: new Date()
    };
    
    const result = await collection.insertOne(sessionToInsert);
    return {
      ...session,
      id: result.insertedId.toString()
    };
  },
  
  /**
   * Get a user session by ID
   */
  async getById(id: string) {
    try {
      const collection = await getCollection('userSessions');
      const session = await collection.findOne({ _id: new ObjectId(id) });
      return session ? mapDocumentToModel<UserSession>(session as WithId<UserSession>) : null;
    } catch (error) {
      console.error('Error getting user session by ID:', error);
      return null;
    }
  },
  
  /**
   * Get a user session by email
   */
  async getByEmail(email: string) {
    const collection = await getCollection('userSessions');
    const session = await collection.findOne({ 
      email,
      expiresAt: { $gt: new Date() }
    });
    return session ? mapDocumentToModel<UserSession>(session as WithId<UserSession>) : null;
  },
  
  /**
   * Update last activity timestamp
   */
  async updateActivity(id: string) {
    const collection = await getCollection('userSessions');
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { lastActivity: new Date() } }
    );
    return this.getById(id);
  },
  
  /**
   * Delete a user session (logout)
   */
  async delete(id: string) {
    const collection = await getCollection('userSessions');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
  
  /**
   * Delete all expired sessions
   */
  async deleteExpired() {
    const collection = await getCollection('userSessions');
    const result = await collection.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    return result.deletedCount;
  }
};