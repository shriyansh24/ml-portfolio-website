import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '../../../src/app/api/blog/route';
import { getServerSession } from 'next-auth';
import { BlogPostsDB } from '../../../src/lib/dbUtils';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('../../../src/lib/dbUtils', () => ({
  BlogPostsDB: {
    getAll: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../../src/lib/utils', () => ({
  generateSlug: jest.fn((title) => title.toLowerCase().replace(/\s+/g, '-')),
}));

describe('Blog API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET handler', () => {
    test('returns blog posts with default pagination', async () => {
      const mockPosts = [
        { id: '1', title: 'Post 1' },
        { id: '2', title: 'Post 2' },
      ];
      
      (BlogPostsDB.getAll as jest.Mock).mockResolvedValue({
        posts: mockPosts,
        total: 2,
        page: 1,
        limit: 6,
        totalPages: 1,
      });
      
      const request = new NextRequest('http://localhost:3000/api/blog');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.posts).toEqual(mockPosts);
      expect(BlogPostsDB.getAll).toHaveBeenCalledWith({
        limit: 6,
        skip: 0,
        tag: undefined,
        featured: undefined,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      });
    });
    
    test('handles query parameters correctly', async () => {
      (BlogPostsDB.getAll as jest.Mock).mockResolvedValue({
        posts: [],
        total: 0,
        page: 2,
        limit: 10,
        totalPages: 0,
      });
      
      const request = new NextRequest('http://localhost:3000/api/blog?page=2&limit=10&tag=react&featured=true');
      await GET(request);
      
      expect(BlogPostsDB.getAll).toHaveBeenCalledWith({
        limit: 10,
        skip: 10,
        tag: 'react',
        featured: true,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      });
    });
    
    test('handles errors gracefully', async () => {
      (BlogPostsDB.getAll as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const request = new NextRequest('http://localhost:3000/api/blog');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch blog posts');
    });
  });
  
  describe('POST handler', () => {
    test('creates a blog post when authenticated as admin', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { role: 'admin' },
      });
      
      const mockPost = {
        title: 'New Post',
        content: 'Post content',
        excerpt: 'Post excerpt',
        tags: ['react', 'nextjs'],
      };
      
      const mockCreatedPost = {
        id: '123',
        ...mockPost,
        slug: 'new-post',
        publishedAt: new Date(),
        updatedAt: new Date(),
        featured: false,
        seoMetadata: {
          title: 'New Post',
          description: 'Post excerpt',
          keywords: ['react', 'nextjs'],
        },
      };
      
      (BlogPostsDB.create as jest.Mock).mockResolvedValue(mockCreatedPost);
      
      const request = new NextRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify(mockPost),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.message).toBe('Blog post created successfully');
      expect(data.post).toEqual(mockCreatedPost);
    });
    
    test('returns 401 when not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      
      const request = new NextRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
    
    test('returns 400 when required fields are missing', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { role: 'admin' },
      });
      
      const request = new NextRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' }), // Missing content and excerpt
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });
    
    test('handles errors gracefully', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { role: 'admin' },
      });
      
      (BlogPostsDB.create as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const request = new NextRequest('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Post',
          content: 'Post content',
          excerpt: 'Post excerpt',
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create blog post');
    });
  });
});