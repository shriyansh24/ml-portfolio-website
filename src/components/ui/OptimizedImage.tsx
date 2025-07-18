import React from 'react';
import Image from 'next/image';
import { getOptimizedImageProps, OptimizedImageProps } from '@/lib/imageUtils';

/**
 * OptimizedImage component that wraps Next.js Image component with optimized props
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/images/example.jpg"
 *   alt="Example image"
 *   size="medium"
 *   priority={true}
 *   className="rounded-lg"
 * />
 * ```
 */
export default function OptimizedImage({
  src,
  alt,
  size = 'medium',
  priority = false,
  className = '',
  ...rest
}: OptimizedImageProps) {
  const imageProps = getOptimizedImageProps({
    src,
    alt,
    size,
    priority,
    className,
    ...rest,
  });

  return <Image {...imageProps} />;
}