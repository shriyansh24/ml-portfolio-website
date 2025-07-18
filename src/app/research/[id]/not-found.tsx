import Link from 'next/link';
import Layout from "@/components/layout/Layout";

export default function PaperNotFound() {
  return (
    <Layout>
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Research Paper Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The research paper you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/research" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Research Papers
        </Link>
      </div>
    </Layout>
  );
}