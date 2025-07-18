import Fuse from 'fuse.js';
import { BlogPost } from '@/types/models';

/**
 * Configure Fuse.js for blog post search
 * @param posts Array of blog posts to search through
 * @returns Fuse instance configured for blog post search
 */
export function createBlogSearchIndex(posts: BlogPost[]): Fuse<BlogPost> {
  return new Fuse(posts, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'excerpt', weight: 1.5 },
      { name: 'content', weight: 1 },
      { name: 'tags', weight: 1.5 }
    ],
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true,
    useExtendedSearch: true
  });
}

/**
 * Find related blog posts based on tags and content similarity
 * @param currentPost The current blog post
 * @param allPosts Array of all blog posts
 * @param limit Maximum number of related posts to return
 * @returns Array of related blog posts
 */
export function findRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
  
  // Calculate a relevance score for each post
  const scoredPosts = otherPosts.map(post => {
    // Score based on shared tags (higher weight)
    const sharedTags = post.tags.filter(tag => 
      currentPost.tags.includes(tag)
    ).length;
    
    const tagScore = sharedTags * 3; // Weight tag matches higher
    
    // Create a simple content-based score using Fuse.js
    const contentFuse = new Fuse([post], {
      keys: ['title', 'excerpt', 'content'],
      includeScore: true,
      threshold: 0.6
    });
    
    // Search using the current post's title and excerpt
    const searchQuery = `${currentPost.title} ${currentPost.excerpt}`;
    const searchResults = contentFuse.search(searchQuery);
    
    // Convert Fuse score (0-1 where 0 is perfect match) to our score system
    const contentScore = searchResults.length > 0 
      ? (1 - (searchResults[0].score || 0.5)) * 2 
      : 0;
    
    // Combine scores
    const totalScore = tagScore + contentScore;
    
    return {
      post,
      score: totalScore
    };
  });
  
  // Sort by score (descending) and take the top 'limit' posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Extract unique tags from blog posts
 * @param posts Array of blog posts
 * @returns Array of unique tags
 */
export function extractUniqueTags(posts: BlogPost[]): string[] {
  const tagsSet = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagsSet.add(tag);
    });
  });
  
  return Array.from(tagsSet).sort();
}