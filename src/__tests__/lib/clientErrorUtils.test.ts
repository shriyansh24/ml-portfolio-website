import {
  isApiErrorResponse,
  handleFetchResponse,
  formatErrorMessage,
  safeAsync,
  getUserFriendlyErrorMessage,
} from '../../../src/lib/clientErrorUtils';

describe('clientErrorUtils', () => {
  describe('isApiErrorResponse', () => {
    test('returns true for valid API error response', () => {
      const validResponse = {
        error: {
          status: 404,
          code: 'NOT_FOUND',
          message: 'Resource not found',
        },
      };
      
      expect(isApiErrorResponse(validResponse)).toBe(true);
    });
    
    test('returns false for invalid API error response', () => {
      const invalidResponses = [
        null,
        undefined,
        {},
        { error: 'string' },
        { error: { status: 404 } },
        { error: { code: 'ERROR' } },
        { error: { message: 'Error message' } },
      ];
      
      invalidResponses.forEach(response => {
        expect(isApiErrorResponse(response)).toBe(false);
      });
    });
  });
  
  describe('handleFetchResponse', () => {
    test('returns data for successful response', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      } as unknown as Response;
      
      const result = await handleFetchResponse(mockResponse);
      expect(result).toEqual(mockData);
    });
    
    test('throws formatted error for API error response', async () => {
      const mockErrorData = {
        error: {
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: { field: 'name' },
        },
      };
      
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue(mockErrorData),
      } as unknown as Response;
      
      await expect(handleFetchResponse(mockResponse)).rejects.toThrow('Validation failed');
      
      try {
        await handleFetchResponse(mockResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as any).status).toBe(400);
        expect((error as any).code).toBe('VALIDATION_ERROR');
        expect((error as any).details).toEqual({ field: 'name' });
      }
    });
    
    test('throws generic error for non-API error response', async () => {
      const mockErrorData = { message: 'Something went wrong' };
      const mockResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue(mockErrorData),
      } as unknown as Response;
      
      await expect(handleFetchResponse(mockResponse)).rejects.toThrow('Something went wrong');
      
      try {
        await handleFetchResponse(mockResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as any).status).toBe(500);
      }
    });
  });
  
  describe('formatErrorMessage', () => {
    test('formats Error object', () => {
      const error = new Error('Test error');
      expect(formatErrorMessage(error)).toBe('Test error');
    });
    
    test('formats string error', () => {
      expect(formatErrorMessage('Test error')).toBe('Test error');
    });
    
    test('handles unknown error types', () => {
      expect(formatErrorMessage(null)).toBe('An unexpected error occurred');
      expect(formatErrorMessage(undefined)).toBe('An unexpected error occurred');
      expect(formatErrorMessage({})).toBe('An unexpected error occurred');
    });
  });
  
  describe('safeAsync', () => {
    test('returns data for successful async function', async () => {
      const mockFn = jest.fn().mockResolvedValue({ id: 1 });
      const result = await safeAsync(mockFn);
      
      expect(result.data).toEqual({ id: 1 });
      expect(result.error).toBeNull();
    });
    
    test('returns error for failed async function', async () => {
      const mockError = new Error('Async error');
      const mockFn = jest.fn().mockRejectedValue(mockError);
      const result = await safeAsync(mockFn);
      
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
    
    test('handles non-Error rejections', async () => {
      const mockFn = jest.fn().mockRejectedValue('String error');
      const result = await safeAsync(mockFn);
      
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('String error');
    });
  });
  
  describe('getUserFriendlyErrorMessage', () => {
    test('returns appropriate message for common HTTP status codes', () => {
      expect(getUserFriendlyErrorMessage(400)).toContain('invalid data');
      expect(getUserFriendlyErrorMessage(401)).toContain('logged in');
      expect(getUserFriendlyErrorMessage(403)).toContain('permission');
      expect(getUserFriendlyErrorMessage(404)).toContain('not found');
      expect(getUserFriendlyErrorMessage(422)).toContain('invalid');
      expect(getUserFriendlyErrorMessage(429)).toContain('Too many requests');
      expect(getUserFriendlyErrorMessage(500)).toContain('internal server error');
      expect(getUserFriendlyErrorMessage(503)).toContain('temporarily unavailable');
    });
    
    test('returns generic message for uncommon status codes', () => {
      expect(getUserFriendlyErrorMessage(418)).toContain('unexpected error');
      expect(getUserFriendlyErrorMessage(999)).toContain('unexpected error');
    });
  });
});