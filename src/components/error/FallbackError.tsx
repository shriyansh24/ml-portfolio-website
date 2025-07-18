import React from 'react';
import Link from 'next/link';

interface FallbackErrorProps {
  error: Error | null;
}

/**
 * FallbackError component that displays a user-friendly error message
 * when an unexpected error occurs in the application.
 */
const FallbackError: React.FC<FallbackErrorProps> = ({ error }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="text-red-500 text-6xl mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className="w-16 h-16"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        We apologize for the inconvenience. Our team has been notified of this issue.
      </p>
      {error && process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-4 rounded-md mb-4 w-full max-w-lg overflow-auto">
          <p className="font-mono text-sm text-red-600">{error.toString()}</p>
        </div>
      )}
      <div className="flex space-x-4">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh Page
        </button>
        <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default FallbackError;