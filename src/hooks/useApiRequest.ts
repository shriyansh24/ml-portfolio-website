import { useState, useCallback } from 'react';
import { handleFetchResponse, formatErrorMessage } from '@/lib/clientErrorUtils';

interface UseApiRequestOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for making API requests with error handling
 */
export function useApiRequest<T>(options: UseApiRequestOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (url: string, config: RequestInit = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetch(url, {
          ...config,
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
        }).then((res) => handleFetchResponse<T>(res));

        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const get = useCallback(
    (url: string, config: Omit<RequestInit, 'method'> = {}) => {
      return execute(url, { ...config, method: 'GET' });
    },
    [execute]
  );

  const post = useCallback(
    (url: string, body: any, config: Omit<RequestInit, 'method' | 'body'> = {}) => {
      return execute(url, {
        ...config,
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    [execute]
  );

  const put = useCallback(
    (url: string, body: any, config: Omit<RequestInit, 'method' | 'body'> = {}) => {
      return execute(url, {
        ...config,
        method: 'PUT',
        body: JSON.stringify(body),
      });
    },
    [execute]
  );

  const del = useCallback(
    (url: string, config: Omit<RequestInit, 'method'> = {}) => {
      return execute(url, { ...config, method: 'DELETE' });
    },
    [execute]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const errorMessage = error ? formatErrorMessage(error) : null;

  return {
    data,
    error,
    errorMessage,
    isLoading,
    execute,
    get,
    post,
    put,
    delete: del,
    reset,
  };
}

export default useApiRequest;