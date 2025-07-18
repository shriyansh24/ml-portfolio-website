/**
 * Utility functions for handling client-side API errors
 */

/**
 * Standard error response structure from API
 */
export interface ApiErrorResponse {
  error: {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Checks if a response is an API error response
 */
export function isApiErrorResponse(data: any): data is ApiErrorResponse {
  return (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof data.error === 'object' &&
    'status' in data.error &&
    'code' in data.error &&
    'message' in data.error
  );
}

/**
 * Handles fetch responses and throws standardized errors
 */
export async function handleFetchResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    // If the response follows our API error format
    if (isApiErrorResponse(data)) {
      const error = new Error(data.error.message);
      (error as any).status = data.error.status;
      (error as any).code = data.error.code;
      (error as any).details = data.error.details;
      throw error;
    }
    
    // Generic error handling
    const error = new Error(data.message || 'An error occurred');
    (error as any).status = response.status;
    throw error;
  }
  
  return data as T;
}

/**
 * Formats an error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Safely executes an async function and returns a result object
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

/**
 * Creates a user-friendly error message based on HTTP status code
 */
export function getUserFriendlyErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The request contains invalid data. Please check your input and try again.';
    case 401:
      return 'You need to be logged in to perform this action.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 422:
      return 'The provided data is invalid. Please check your input and try again.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    case 503:
      return 'The service is temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
}