import { NextApiRequest, NextApiResponse } from 'next';
import { handleApiError } from './apiErrorUtils';

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

/**
 * Middleware to handle API errors consistently
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      handleApiError(error, res);
    }
  };
}

/**
 * Middleware to validate request method
 */
export function withMethodValidation(handler: ApiHandler, allowedMethods: string[]): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!allowedMethods.includes(req.method || '')) {
      return res.status(405).json({
        error: {
          status: 405,
          code: 'METHOD_NOT_ALLOWED',
          message: `Method ${req.method} Not Allowed`,
        },
      });
    }
    
    await handler(req, res);
  };
}

/**
 * Middleware to validate authentication
 */
export function withAuthentication(handler: ApiHandler): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Check if user is authenticated
    const session = req.session; // This would be populated by NextAuth.js
    
    if (!session || !session.user) {
      return res.status(401).json({
        error: {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }
    
    await handler(req, res);
  };
}

/**
 * Combine multiple middleware functions
 */
export function withMiddleware(handler: ApiHandler, middlewares: Array<(h: ApiHandler) => ApiHandler>): ApiHandler {
  return middlewares.reduceRight((h, middleware) => middleware(h), handler);
}