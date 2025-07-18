import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';
import { formatErrorMessage } from '@/lib/clientErrorUtils';

interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Custom hook for handling form submissions with error handling
 */
export function useFormSubmit<T = any>(options: UseFormSubmitOptions<T> = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const toast = useToast();

  const submitForm = useCallback(
    async (
      url: string,
      formData: any,
      method: 'POST' | 'PUT' | 'PATCH' = 'POST'
    ) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.error?.message || 
            responseData.message || 
            'An error occurred while submitting the form'
          );
        }

        setData(responseData);
        
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        
        if (options.onSuccess) {
          options.onSuccess(responseData);
        }

        return responseData;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        
        const errorMessage = options.errorMessage || formatErrorMessage(errorObj);
        toast.error(errorMessage);
        
        if (options.onError) {
          options.onError(errorObj);
        }
        
        throw errorObj;
      } finally {
        setIsSubmitting(false);
      }
    },
    [options, toast]
  );

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setError(null);
    setData(null);
  }, []);

  return {
    submitForm,
    isSubmitting,
    error,
    data,
    reset,
  };
}

export default useFormSubmit;