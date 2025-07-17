"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-24 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-6">Something went wrong</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        An error occurred while rendering this page. Please try again or return to the homepage.
      </p>
      <div className="flex gap-4">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}