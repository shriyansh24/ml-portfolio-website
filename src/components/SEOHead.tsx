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
  // Enhanced schema properties
  schemaType?: "WebSite" | "Article" | "Person" | "Project" | "BlogPosting" | "ScholarlyArticle" | "TechArticle";
  breadcrumbs?: Array<{ name: string; url: string }>;
  organization?: {
    name: string;
    logo?: string;
    url?: string;
  };
  datePublished?: string;
  dateModified?: string;
  articleBody?: string;
  articleSection?: string;
  wordCount?: number;
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
  // Enhanced schema properties
  schemaType = "WebSite",
  breadcrumbs = [],
  organization = { name: "ML Portfolio" },
  datePublished,
  dateModified,
  articleBody,
  articleSection,
  wordCount,
}: SEOHeadProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ml-portfolio.example.com';
  const keywordsString = keywords.join(", ");
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;
  
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
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: ogUrl,
      languages: {
        'en-US': ogUrl,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: {
        me: [twitterHandle],
      },
    },
    metadataBase: new URL(baseUrl),
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
        url: fullOgImage,
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
      authors: [author],
      publishedTime: publishedTime || datePublished,
      modifiedTime: modifiedTime || dateModified,
      section: section || articleSection,
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
    images: [fullOgImage],
  };
  
  // Generate structured data based on schema type
  let structuredData: any = {};
  
  switch (schemaType) {
    case "Article":
    case "BlogPosting":
    case "TechArticle":
    case "ScholarlyArticle":
      structuredData = {
        "@context": "https://schema.org",
        "@type": schemaType,
        headline: title,
        description,
        image: fullOgImage,
        author: {
          "@type": "Person",
          name: author,
        },
        publisher: {
          "@type": "Organization",
          name: organization.name,
          logo: organization.logo ? {
            "@type": "ImageObject",
            url: organization.logo.startsWith("http") ? organization.logo : `${baseUrl}${organization.logo}`,
          } : undefined,
        },
        datePublished: datePublished || publishedTime,
        dateModified: dateModified || modifiedTime || datePublished || publishedTime,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": ogUrl,
        },
        ...(articleBody && { articleBody }),
        ...(articleSection && { articleSection }),
        ...(wordCount && { wordCount }),
        ...(tags && { keywords: tags.join(", ") }),
      };
      break;
      
    case "Person":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author,
        description,
        image: fullOgImage,
        url: ogUrl,
      };
      break;
      
    case "Project":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: title,
        description,
        image: fullOgImage,
        author: {
          "@type": "Person",
          name: author,
        },
        datePublished: datePublished || publishedTime,
        dateModified: dateModified || modifiedTime,
        applicationCategory: "DeveloperApplication",
      };
      break;
      
    default:
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: title,
        description,
        url: ogUrl,
        author: {
          "@type": "Person",
          name: author,
        },
        image: fullOgImage,
      };
  }
  
  // Add breadcrumbs if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbsData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith("http") ? crumb.url : `${baseUrl}${crumb.url}`,
      })),
    };
    
    // Add breadcrumbs as a separate JSON-LD script
    metadata.other = {
      ...(metadata.other || {}),
      "script:ld+json": [
        JSON.stringify(structuredData),
        JSON.stringify(breadcrumbsData),
      ],
    };
  } else {
    metadata.other = {
      ...(metadata.other || {}),
      "script:ld+json": JSON.stringify(structuredData),
    };
  }
  
  return metadata;
}