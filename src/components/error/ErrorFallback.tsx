import React from 'react';
import Link from 'next/link';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  showRefresh?: boolean;
  showHome?: boolean;
}

/**
 * A general-purpose error fallback component that can be used throughout the application
 * to display user-friendly error messages when something goes wrong.
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'Something went wrong',
  message = 'We apologize for the inconvenience. Please try again later.',
  showRefresh = true,
  showHome = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-sm my-4">
      <div className="text-red-500 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className="w-12 h-12"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      <div className="flex space-x-4">
        {showRefresh && (
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        )}
        {showHome && (
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Go to Homepage
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;