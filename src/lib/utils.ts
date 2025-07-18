/**
 * Utility functions for the ML Portfolio Website
 */

/**
 * Utility function for combining class names
 * @param classes Array of class names, booleans, or objects
 * @returns Combined class names as a string
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .map(cls => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, condition]) => condition)
          .map(([className]) => className)
          .join(' ');
      }
      return cls;
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Generate a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
}

/**
 * Format a date as a string
 * @param dateString The date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Truncate text to a specified length
 * @param text The text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Extract plain text from HTML/Markdown content
 * @param content HTML or Markdown content
 * @returns Plain text without HTML tags
 */
export function extractPlainText(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace Markdown links with just the text
    .replace(/[*_~`#]/g, '') // Remove Markdown formatting characters
    .trim();
}

/**
 * Generate excerpt from content
 * @param content Full content
 * @param maxLength Maximum length of excerpt
 * @returns Truncated excerpt
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = extractPlainText(content);
  return truncateText(plainText, maxLength);
}