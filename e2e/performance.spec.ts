import { test, expect } from '@playwright/test';

// This test is a placeholder for performance testing
// The actual performance testing will be done using Lighthouse CI
// which is configured in lighthouserc.js

test.describe('Performance', () => {
  test('should load the homepage quickly', async ({ page }) => {
    // Record performance metrics
    const performanceEntries: PerformanceEntry[] = [];
    
    // Listen for performance entries
    await page.evaluate(() => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // @ts-ignore
          window.performanceEntries = window.performanceEntries || [];
          // @ts-ignore
          window.performanceEntries.push({
            name: entry.name,
            entryType: entry.entryType,
            startTime: entry.startTime,
            duration: entry.duration,
          });
        }
      });
      
      observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'mark', 'measure'] });
    });
    
    // Navigate to the homepage
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Get performance entries
    const entries = await page.evaluate(() => {
      // @ts-ignore
      return window.performanceEntries || [];
    });
    
    // Log performance metrics for debugging
    console.log(`Page load time: ${loadTime}ms`);
    
    // Find First Contentful Paint (FCP)
    const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
    if (fcp) {
      console.log(`First Contentful Paint: ${fcp.startTime}ms`);
      // Ensure FCP is under 2000ms (this is a loose threshold for testing)
      expect(fcp.startTime).toBeLessThan(2000);
    }
    
    // This is just a basic test - Lighthouse CI will do more comprehensive testing
    expect(loadTime).toBeLessThan(5000);
  });
});