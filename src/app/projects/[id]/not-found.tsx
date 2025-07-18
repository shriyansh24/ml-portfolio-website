import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Project Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button href="/projects" variant="primary">
          Back to Projects
        </Button>
      </div>
    </div>
  );
}