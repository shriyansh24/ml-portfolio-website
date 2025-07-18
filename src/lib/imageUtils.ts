/**
 * Image optimization utilities for Next.js Image component
 */

import { ImageProps } from 'next/image';

/**
 * Default image sizes for responsive images
 * These sizes are used for the sizes prop in the Next.js Image component
 */
export const defaultImageSizes = {
  small: '(max-width: 640px) 100vw, 300px',
  medium: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px',
  large: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px',
  hero: '100vw',
  full: '100vw',
};

/**
 * Default image placeholder options
 */
export const imagePlaceholderOptions = {
  blur: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOQKcQAAAABJRU5ErkJggg==',
};

/**
 * Interface for optimized image props
 */
export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  size?: keyof typeof defaultImageSizes;
  priority?: boolean;
  className?: string;
}

/**
 * Get optimized image props for Next.js Image component
 * 
 * @param props - Image props
 * @returns Optimized image props
 * 
 * @example
 * ```tsx
 * import Image from 'next/image';
 * import { getOptimizedImageProps } from '@/lib/imageUtils';
 * 
 * export default function MyComponent() {
 *   const imageProps = getOptimizedImageProps({
 *     src: '/images/example.jpg',
 *     alt: 'Example image',
 *     size: 'medium',
 *   });
 *   
 *   return <Image {...imageProps} />;
 * }
 * ```
 */
export function getOptimizedImageProps({
  src,
  alt,
  size = 'medium',
  priority = false,
  className = '',
  ...rest
}: OptimizedImageProps): ImageProps {
  // Determine if the image is external (starts with http or https)
  const isExternal = src.startsWith('http');
  
  // Set width and height based on size if not provided
  const defaultSizes = {
    small: { width: 300, height: 200 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 800 },
    hero: { width: 1920, height: 1080 },
    full: { width: 1920, height: 1080 },
  };
  
  // Use provided width/height or default based on size
  const width = rest.width || defaultSizes[size].width;
  const height = rest.height || defaultSizes[size].height;
  
  return {
    src,
    alt,
    width,
    height,
    sizes: defaultImageSizes[size],
    priority,
    className,
    // Add placeholder for non-priority images
    ...(priority ? {} : { placeholder: 'blur', blurDataURL: imagePlaceholderOptions.blur }),
    // Add loading strategy based on priority
    loading: priority ? 'eager' : 'lazy',
    // Add quality setting
    quality: 90,
    // Add other props
    ...rest,
  };
}

/**
 * Generate responsive image srcSet for use outside of Next.js Image component
 * 
 * @param basePath - Base path to the image
 * @param widths - Array of widths to generate srcSet for
 * @returns srcSet string
 * 
 * @example
 * ```tsx
 * import { generateSrcSet } from '@/lib/imageUtils';
 * 
 * const srcSet = generateSrcSet('/images/example.jpg', [300, 600, 900, 1200]);
 * ```
 */
export function generateSrcSet(basePath: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  // If the image is external, return empty string
  if (basePath.startsWith('http')) {
    return '';
  }
  
  // Generate srcSet string
  return widths
    .map((width) => `${basePath}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Get image dimensions from a URL or path
 * This is a placeholder function that would normally use an image processing library
 * 
 * @param src - Image URL or path
 * @returns Promise with image dimensions
 */
export async function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  // In a real implementation, this would use an image processing library
  // For now, return default dimensions
  return { width: 1200, height: 800 };
}