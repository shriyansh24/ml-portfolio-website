import { Metadata } from "next";

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  ogType?: "website" | "article" | "profile" | "book";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  twitterHandle?: string;
  noIndex?: boolean;
}

/**
 * Generate metadata for a page using Next.js App Router metadata pattern
 * 
 * @example
 * // In a page.tsx file:
 * export const metadata = generateMetadata({
 *   title: "My Page Title",
 *   description: "Page description",
 *   keywords: ["keyword1", "keyword2"],
 * });
 */
export function generateMetadata({
  title = "ML Portfolio | Machine Learning Engineer",
  description = "Portfolio website showcasing machine learning projects, blog posts, and research papers focused on LLMs and AI",
  keywords = ["machine learning", "artificial intelligence", "LLM", "portfolio", "transformer", "deep learning"],
  ogImage = "/og-image.jpg",
  ogUrl = "https://ml-portfolio.example.com",
  ogType = "website",
  author = "ML Engineer",
  publishedTime,
  modifiedTime,
  section,
  tags,
  twitterHandle = "@mlportfolio",
  noIndex = false,
}: SEOHeadProps): Metadata {
  const keywordsString = keywords.join(", ");
  
  // Base metadata
  const metadata: Metadata = {
    title: {
      absolute: title,
      template: "%s | ML Portfolio",
    },
    description,
    keywords: keywordsString,
    authors: [{ name: author }],
    creator: author,
    publisher: "ML Portfolio",
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates: {
      canonical: ogUrl,
    },
  };
  
  // Open Graph metadata
  const openGraphBase = {
    title,
    description,
    url: ogUrl,
    siteName: "ML Portfolio",
    locale: "en_US",
    type: ogType,
    images: [
      {
        url: ogImage.startsWith("http") ? ogImage : `https://ml-portfolio.example.com${ogImage}`,
        width: 1200,
        height: 630,
        alt: title,
      }
    ],
  };
  
  // Add article-specific OG metadata if type is article
  if (ogType === "article") {
    metadata.openGraph = {
      ...openGraphBase,
      type: "article",
      // Fix the article property structure to match OpenGraphArticle type
      authors: [author],
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      section: section,
      tags: tags,
    };
  } else {
    metadata.openGraph = openGraphBase;
  }
  
  // Twitter metadata
  metadata.twitter = {
    card: "summary_large_image",
    title,
    description,
    creator: twitterHandle,
    images: [ogImage],
  };
  
  // JSON-LD structured data
  metadata.other = {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": ogType === "article" ? "Article" : "WebSite",
      headline: title,
      description,
      author: {
        "@type": "Person",
        name: author,
      },
      ...(ogType === "article" && {
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
      }),
      image: ogImage,
      url: ogUrl,
    }),
  };
  
  return metadata;
}