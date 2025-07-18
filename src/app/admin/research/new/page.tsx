import { redirect } from 'next/navigation';
import Layout from "@/components/layout/Layout";
import { generateMetadata } from "@/components/SEOHead";
import PaperEditor from "@/components/research/PaperEditor";
import { getServerSession } from "@/lib/auth";

export const metadata = generateMetadata({
  title: "Add New Research Paper | Admin",
  description: "Add a new research paper to the portfolio",
  noIndex: true,
});

export default async function NewPaperPage() {
  // Check authentication
  const session = await getServerSession();
  if (!session) {
    redirect('/login?callbackUrl=/admin/research/new');
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <PaperEditor />
      </div>
    </Layout>
  );
}