import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Blog Post Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The blog post you're looking for doesn't exist or has been removed.
      </p>
      <Link 
        href="/blog" 
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
      >
        Back to Blog
      </Link>
    </div>
  );
}