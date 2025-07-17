import Layout from "@/components/layout/Layout";
import { generateMetadata } from "@/components/SEOHead";

export const metadata = generateMetadata({
  title: "Blog | ML Portfolio",
  description: "Articles and insights on machine learning, AI, and transformer models",
  keywords: ["blog", "machine learning", "AI", "transformer", "LLM", "tutorials"],
});

export default function BlogPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Thoughts, tutorials, and insights on machine learning, AI, and transformer models.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog post placeholders */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <div className="h-48 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Blog Image</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Blog Post {i}</h2>
                <p className="text-sm text-muted-foreground mb-2">July 16, 2025</p>
                <p className="text-muted-foreground mb-4">
                  A brief description of this blog post about machine learning or AI topics.
                </p>
                <a 
                  href={`/blog/post-${i}`} 
                  className="text-primary hover:underline"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}