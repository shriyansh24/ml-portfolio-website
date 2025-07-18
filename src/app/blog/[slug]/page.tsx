import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/dbUtils';
import BlogPost from '@/components/blog/BlogPost';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { generateMetadata } from '@/components/SEOHead';
import StructuredData, { generateArticleData, generateBreadcrumbData } from '@/components/SEOStructuredData';

// Define params type for generateStaticParams
type Params = {
  slug: string;
};

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  try {
    const { db } = await connectToDatabase();
    const posts = await db.collection('blogPosts').find({}, { projection: { slug: 1 } }).toArray();
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const { db } = await connectToDatabase();
    const post = await db.collection('blogPosts').findOne({ slug: params.slug });
    
    if (!post) {
      return generateMetadata({
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
        noIndex: true,
      });
    }
    
    return generateMetadata({
      title: post.title,
      description: post.excerpt || `${post.content.substring(0, 160)}...`,
      ogImage: post.coverImage || '/images/blog-default.jpg',
      ogUrl: `/blog/${post.slug}`,
      ogType: 'article',
      author: post.author || 'ML Engineer',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      schemaType: 'BlogPosting',
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      articleBody: post.content,
      wordCount: post.content.split(/\\s+/).length,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.title, url: `/blog/${post.slug}` },
      ],
    });
  } catch (error) {
    console.error('Error generating metadata for blog post:', error);
    return generateMetadata({
      title: 'Blog Post',
      description: 'ML Portfolio blog post',
    });
  }
}

// Blog post page component
export default async function BlogPostPage({ params }: { params: Params }) {
  try {
    const { db } = await connectToDatabase();
    const post = await db.collection('blogPosts').findOne({ slug: params.slug });
    
    if (!post) {
      notFound();
    }
    
    // Get related posts based on tags
    const relatedPosts = await db.collection('blogPosts').find({
      slug: { $ne: params.slug },
      tags: { $in: post.tags || [] },
    }, {
      projection: {
        title: 1,
        slug: 1,
        excerpt: 1,
        publishedAt: 1,
        tags: 1,
        coverImage: 1,
      },
      limit: 3,
    }).toArray();
    
    // Generate structured data for the article
    const articleData = generateArticleData({
      title: post.title,
      description: post.excerpt || `${post.content.substring(0, 160)}...`,
      url: `/blog/${post.slug}`,
      imageUrl: post.coverImage || '/images/blog-default.jpg',
      authorName: post.author || 'ML Engineer',
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      tags: post.tags,
      wordCount: post.content.split(/\\s+/).length,
    });
    
    // Generate breadcrumb structured data
    const breadcrumbData = generateBreadcrumbData([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` },
    ]);
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Add structured data */}
        <StructuredData data={articleData} />
        <StructuredData data={breadcrumbData} />
        
        {/* Render blog post */}
        <BlogPost post={post} />
        
        {/* Render related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}

// Set revalidation time for incremental static regeneration (ISR)
export const revalidate = 3600; // Revalidate every hour