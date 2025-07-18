import Link from 'next/link';
import { redirect } from 'next/navigation';
import Layout from "@/components/layout/Layout";
import { generateMetadata } from "@/components/SEOHead";
import PapersList from "@/components/research/PapersList";
import { ResearchPapersDB } from "@/lib/dbUtils";
import { getServerSession } from "@/lib/auth";

export const metadata = generateMetadata({
  title: "Manage Research Papers | Admin",
  description: "Admin interface for managing research papers",
  noIndex: true,
});

export default async function AdminResearchPage() {
  // Check authentication
  const session = await getServerSession();
  if (!session) {
    redirect('/login?callbackUrl=/admin/research');
  }
  
  // Fetch papers
  const { papers } = await ResearchPapersDB.getAll({ limit: 10 });
  
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Research Papers</h1>
          <Link 
            href="/admin/research/new" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Paper
          </Link>
        </div>
        
        <PapersList initialPapers={papers} isAdmin={true} />
      </div>
    </Layout>
  );
}