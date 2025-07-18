import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/ML Portfolio/);
    
    // Check that the header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check that the navigation links are present
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(await navLinks.count());
    
    // Check that the hero section is visible
    const heroSection = page.locator('section:first-of-type');
    await expect(heroSection).toBeVisible();
    
    // Check that the footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
  
  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');
    
    // Click on the About link
    await page.getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/.*#about/);
    
    // Click on the Projects link
    await page.getByRole('link', { name: /projects/i }).click();
    await expect(page).toHaveURL(/.*#projects/);
    
    // Click on the Contact link
    await page.getByRole('link', { name: /contact/i }).click();
    await expect(page).toHaveURL(/.*#contact/);
  });
  
  test('should have responsive design', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Test on desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    
    // Check if navigation is visible on desktop
    const desktopNav = page.locator('nav');
    await expect(desktopNav).toBeVisible();
  });
});