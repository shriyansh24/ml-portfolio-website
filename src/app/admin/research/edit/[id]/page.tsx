import { notFound, redirect } from 'next/navigation';
import Layout from "@/components/layout/Layout";
import { generateMetadata } from "@/components/SEOHead";
import PaperEditor from "@/components/research/PaperEditor";
import { ResearchPapersDB } from "@/lib/dbUtils";
import { getServerSession } from "@/lib/auth";
import { Metadata } from 'next';

interface Params {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const paper = await ResearchPapersDB.getById(params.id);
  
  if (!paper) {
    return generateMetadata({
      title: "Paper Not Found | Admin",
      description: "The requested research paper could not be found.",
      noIndex: true,
    });
  }
  
  return generateMetadata({
    title: `Edit: ${paper.title} | Admin`,
    description: `Edit research paper: ${paper.title}`,
    noIndex: true,
  });
}

export default async function EditPaperPage({ params }: Params) {
  // Check authentication
  const session = await getServerSession();
  if (!session) {
    redirect(`/login?callbackUrl=/admin/research/edit/${params.id}`);
  }
  
  const paper = await ResearchPapersDB.getById(params.id);
  
  if (!paper) {
    notFound();
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <PaperEditor paper={paper} isEdit={true} />
      </div>
    </Layout>
  );
}