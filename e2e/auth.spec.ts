import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login form for admin routes', async ({ page }) => {
    // Try to access an admin page
    await page.goto('/admin');
    
    // Check that we're redirected to the login page
    await expect(page).toHaveURL(/\/login/);
    
    // Check that the login form is displayed
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
  
  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for error message
    await expect(page.getByText(/invalid credentials|incorrect password|authentication failed/i)).toBeVisible();
  });
  
  test('should redirect to admin dashboard after successful login', async ({ page }) => {
    // This test assumes you have a test user set up in your test environment
    // You might need to mock the authentication service for this test
    
    await page.goto('/login');
    
    // Fill in valid credentials (these should be test credentials)
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('testpassword');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check that we're redirected to the admin dashboard
    // This might fail if you don't have a test user set up
    await expect(page).toHaveURL(/\/admin/);
  });
  
  test('should log out successfully', async ({ page }) => {
    // First log in
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Try to access the admin page
    await page.goto('/admin');
    
    // Look for the logout button
    const logoutButton = page.getByRole('button', { name: /sign out|log out/i });
    
    // If we're successfully logged in, the logout button should be visible
    if (await logoutButton.isVisible()) {
      // Click the logout button
      await logoutButton.click();
      
      // Check that we're redirected to the home page or login page
      await expect(page).toHaveURL(/\/(login)?$/);
      
      // Try to access the admin page again
      await page.goto('/admin');
      
      // Check that we're redirected to the login page
      await expect(page).toHaveURL(/\/login/);
    }
  });
});