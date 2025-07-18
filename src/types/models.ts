/**
 * Data models for the ML Portfolio Website
 * These interfaces define the structure of data used throughout the application
 */

/**
 * Media File Model
 * Represents a media file (image, document, etc.) in the system
 */
export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
  category: string;
  alt?: string;
  caption?: string;
  tags?: string[];
}

/**
 * Blog Post Model
 * Represents a blog post in the system
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Rich text/Markdown
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  featured: boolean;
  seoMetadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

/**
 * Research Paper Model
 * Represents a research paper entry with annotations
 */
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: Date;
  venue: string;
  doi?: string;
  arxivId?: string;
  pdfUrl?: string;
  categories: string[];
  personalAnnotations: string;
  keyFindings: string[];
  relevanceScore: number;
  addedAt: Date;
}

/**
 * Portfolio Data Model
 * Represents the portfolio owner's professional information
 */
export interface PortfolioData {
  id: string;
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    socialLinks: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      scholar?: string;
    };
  };
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    technologies: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    graduationDate: Date;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    featured: boolean;
  }[];
}

/**
 * User Session Model
 * Represents an authenticated user session
 */
export interface UserSession {
  id: string;
  email: string;
  role: 'admin';
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}