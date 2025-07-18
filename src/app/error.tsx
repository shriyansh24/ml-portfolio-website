'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error handler for Next.js App Router
 * This component will catch any errors that occur during rendering
 * and display a user-friendly error message
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
    
    // You could also log to a service like Sentry here
    // Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-16 h-16 mx-auto"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Our team has been notified of this issue.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-4 rounded-md mb-6 text-left overflow-auto max-h-40">
            <p className="font-mono text-sm text-red-600 break-words">{error.message}</p>
            {error.digest && (
              <p className="font-mono text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <button 
            onClick={reset} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}