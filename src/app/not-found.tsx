import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto py-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <h2 className="text-2xl font-medium mb-8">Page Not Found</h2>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button variant="primary" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </Layout>
  );
}