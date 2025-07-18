import { test, expect } from '@playwright/test';

test.describe('Blog Section', () => {
  test('should display blog posts list', async ({ page }) => {
    await page.goto('/blog');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Blog/);
    
    // Check that blog posts are loaded
    const blogPosts = page.locator('article');
    
    // Wait for blog posts to load (they might be fetched asynchronously)
    await expect(async () => {
      const count = await blogPosts.count();
      expect(count).toBeGreaterThan(0);
    }).toPass({ timeout: 5000 });
    
    // Check that each blog post has a title and excerpt
    for (let i = 0; i < await blogPosts.count(); i++) {
      const post = blogPosts.nth(i);
      await expect(post.locator('h2')).toBeVisible();
      await expect(post.locator('p')).toBeVisible();
    }
  });
  
  test('should navigate to individual blog post', async ({ page }) => {
    await page.goto('/blog');
    
    // Wait for blog posts to load
    const blogPosts = page.locator('article');
    await expect(blogPosts.first()).toBeVisible();
    
    // Click on the first blog post
    await blogPosts.first().locator('a').click();
    
    // Check that we've navigated to the blog post page
    await expect(page).toHaveURL(/\/blog\/[\w-]+/);
    
    // Check that the blog post content is displayed
    await expect(page.locator('article h1')).toBeVisible();
    await expect(page.locator('article .content')).toBeVisible();
  });
  
  test('should search for blog posts', async ({ page }) => {
    await page.goto('/blog');
    
    // Find the search input
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    // Enter a search term
    await searchInput.fill('react');
    await searchInput.press('Enter');
    
    // Wait for search results to update
    await page.waitForTimeout(500);
    
    // Check that search results are displayed
    const searchResults = page.locator('article');
    
    // Either we have search results or a "no results" message
    const count = await searchResults.count();
    if (count > 0) {
      // If we have results, check that they contain the search term
      for (let i = 0; i < count; i++) {
        const postText = await searchResults.nth(i).textContent();
        expect(postText?.toLowerCase()).toContain('react');
      }
    } else {
      // If no results, check for a "no results" message
      await expect(page.getByText(/no results found/i)).toBeVisible();
    }
  });
  
  test('should filter blog posts by tag', async ({ page }) => {
    await page.goto('/blog');
    
    // Wait for tags to load
    const tagCloud = page.locator('.tag-cloud');
    await expect(tagCloud).toBeVisible();
    
    // Click on the first tag
    const firstTag = tagCloud.locator('a').first();
    const tagText = await firstTag.textContent();
    await firstTag.click();
    
    // Wait for filtered results to load
    await page.waitForTimeout(500);
    
    // Check that the URL contains the tag
    await expect(page).toHaveURL(/\/blog\?tag=[\w-]+/);
    
    // Check that the active tag is highlighted
    await expect(page.getByText(tagText || '')).toHaveClass(/active/);
  });
});