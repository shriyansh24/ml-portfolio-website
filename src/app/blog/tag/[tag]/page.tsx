import { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { BlogPostsDB } from '@/lib/dbUtils';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  
  return {
    title: `${tag} | Blog | ML Portfolio`,
    description: `Articles and insights related to ${tag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  
  // Fetch initial blog posts for this tag
  const result = await BlogPostsDB.getAll({
    limit: 6,
    skip: 0,
    tag,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">
        Blog Posts Tagged: <span className="text-primary">#{tag}</span>
      </h1>
      
      <BlogList initialPosts={result.posts} postsPerPage={6} />
    </div>
  );
}