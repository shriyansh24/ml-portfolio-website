import React from 'react';
import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * Component for adding structured data to a page
 * This component should be used in pages that need specific structured data
 * 
 * @example
 * ```tsx
 * <StructuredData
 *   data={{
 *     "@context": "https://schema.org",
 *     "@type": "BlogPosting",
 *     "headline": "My Blog Post",
 *     "author": {
 *       "@type": "Person",
 *       "name": "John Doe"
 *     },
 *     "datePublished": "2023-01-01",
 *     "dateModified": "2023-01-02",
 *     "description": "This is my blog post",
 *   }}
 * />
 * ```
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generate breadcrumb structured data
 * 
 * @param items - Array of breadcrumb items
 * @returns Breadcrumb structured data object
 * 
 * @example
 * ```tsx
 * const breadcrumbData = generateBreadcrumbData([
 *   { name: 'Home', url: '/' },
 *   { name: 'Blog', url: '/blog' },
 *   { name: 'My Blog Post', url: '/blog/my-blog-post' },
 * ]);
 * 
 * <StructuredData data={breadcrumbData} />
 * ```
 */
export function generateBreadcrumbData(items: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ml-portfolio.example.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate article structured data
 * 
 * @param article - Article data
 * @returns Article structured data object
 * 
 * @example
 * ```tsx
 * const articleData = generateArticleData({
 *   title: 'My Blog Post',
 *   description: 'This is my blog post',
 *   url: '/blog/my-blog-post',
 *   imageUrl: '/images/blog/my-blog-post.jpg',
 *   authorName: 'John Doe',
 *   datePublished: '2023-01-01',
 *   dateModified: '2023-01-02',
 *   tags: ['tag1', 'tag2'],
 * });
 * 
 * <StructuredData data={articleData} />
 * ```
 */
export function generateArticleData({
  title,
  description,
  url,
  imageUrl,
  authorName,
  datePublished,
  dateModified,
  tags = [],
  articleBody,
  wordCount,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  authorName: string;
  datePublished: string;
  dateModified?: string;
  tags?: string[];
  articleBody?: string;
  wordCount?: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ml-portfolio.example.com';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    "headline": title,
    "description": description,
    "image": fullImageUrl,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": "ML Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.svg`,
      },
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "keywords": tags.join(", "),
    ...(articleBody && { "articleBody": articleBody }),
    ...(wordCount && { "wordCount": wordCount }),
  };
}

/**
 * Generate FAQ structured data
 * 
 * @param questions - Array of questions and answers
 * @returns FAQ structured data object
 * 
 * @example
 * ```tsx
 * const faqData = generateFAQData([
 *   { question: 'What is your name?', answer: 'My name is John Doe.' },
 *   { question: 'What do you do?', answer: 'I am a software engineer.' },
 * ]);
 * 
 * <StructuredData data={faqData} />
 * ```
 */
export function generateFAQData(questions: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
}