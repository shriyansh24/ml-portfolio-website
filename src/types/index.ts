// Core data models for the portfolio website

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured?: boolean;
  seoMetadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: string;
  venue: string;
  doi?: string;
  arxivId?: string;
  pdfUrl?: string;
  categories: string[];
  personalAnnotations?: string;
  keyFindings?: string[];
  relevanceScore?: number;
  addedAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface UserSession {
  user: User;
  expires: string;
}