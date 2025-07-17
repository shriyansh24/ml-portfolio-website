import Layout from "@/components/layout/Layout";
import { generateMetadata } from "@/components/SEOHead";

export const metadata = generateMetadata({
  title: "Research Papers | ML Portfolio",
  description: "Curated collection of research papers on machine learning, AI, and transformer models",
  keywords: ["research", "papers", "machine learning", "AI", "transformer", "LLM", "academic"],
});

export default function ResearchPage() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Research Papers</h1>
        <p className="text-lg text-muted-foreground mb-12">
          A curated collection of important research papers in machine learning and AI with my annotations.
        </p>
        
        <div className="space-y-8">
          {/* Research paper placeholders */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">Research Paper Title {i}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Authors: Author One, Author Two, et al. • Published: 2023 • Conference: ICML
              </p>
              <p className="mb-4">
                Abstract: This paper presents a novel approach to transformer architecture that improves
                efficiency while maintaining performance on key NLP benchmarks.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-muted text-xs px-2 py-1 rounded-full">Transformers</span>
                <span className="bg-muted text-xs px-2 py-1 rounded-full">NLP</span>
                <span className="bg-muted text-xs px-2 py-1 rounded-full">Efficiency</span>
              </div>
              <div className="flex gap-4">
                <a 
                  href={`/research/paper-${i}`} 
                  className="text-primary hover:underline"
                >
                  View details
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:underline"
                >
                  Original paper
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}