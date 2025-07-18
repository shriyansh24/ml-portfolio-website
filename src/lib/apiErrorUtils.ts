import { NextApiResponse } from 'next';

/**
 * Standard error response structure for API endpoints
 */
export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Error codes for common API errors
 */
export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
}

/**
 * Map of HTTP status codes to error codes
 */
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
  DATABASE_ERROR: 503,
};

/**
 * Sends a standardized error response from an API endpoint
 */
export function sendApiError(
  res: NextApiResponse,
  status: number,
  code: string,
  message: string,
  details?: unknown
): void {
  const error: ApiError = {
    status,
    code,
    message,
    ...(details && { details }),
  };

  // In production, remove sensitive details
  if (process.env.NODE_ENV === 'production' && status >= 500) {
    delete error.details;
  }

  res.status(status).json({ error });
}

/**
 * Handles errors in API routes and sends appropriate responses
 */
export function handleApiError(err: unknown, res: NextApiResponse): void {
  console.error('API Error:', err);

  // Handle known error types
  if (err instanceof Error) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return sendApiError(
        res,
        HTTP_STATUS.VALIDATION_ERROR,
        ErrorCode.VALIDATION_ERROR,
        'Validation failed',
        err.message
      );
    }

    // Handle database errors
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      return sendApiError(
        res,
        HTTP_STATUS.DATABASE_ERROR,
        ErrorCode.DATABASE_ERROR,
        'Database operation failed',
        process.env.NODE_ENV !== 'production' ? err.message : undefined
      );
    }

    // Handle authentication errors
    if (err.name === 'AuthenticationError') {
      return sendApiError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ErrorCode.AUTHENTICATION_ERROR,
        'Authentication failed',
        process.env.NODE_ENV !== 'production' ? err.message : undefined
      );
    }
  }

  // Default to internal server error for unhandled errors
  sendApiError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ErrorCode.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred',
    process.env.NODE_ENV !== 'production' ? String(err) : undefined
  );
}

/**
 * Client-side API error handler
 */
export async function handleFetchResponse(response: Response): Promise<any> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.error?.message || `API error: ${response.status}`
    );
    (error as any).status = response.status;
    (error as any).code = errorData.error?.code;
    throw error;
  }
  return response.json();
}

/**
 * Creates a validation error
 */
export function createValidationError(message: string): Error {
  const error = new Error(message);
  error.name = 'ValidationError';
  return error;
}