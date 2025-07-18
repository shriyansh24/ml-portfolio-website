// Core data models for the portfolio website
// Re-export all models from the models.ts file
export * from './models';

// Legacy interfaces for backward compatibility
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