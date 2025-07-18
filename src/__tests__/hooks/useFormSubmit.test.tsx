import { renderHook, act } from '@testing-library/react';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { ToastProvider } from '../../../components/ui/Toast';
import React from 'react';

// Mock fetch
global.fetch = jest.fn();

// Mock toast functions
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

// Mock the useToast hook
jest.mock('../../../components/ui/Toast', () => ({
  ...jest.requireActual('../../../components/ui/Toast'),
  useToast: () => mockToast,
}));

describe('useFormSubmit Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  test('handles successful form submission', async () => {
    const mockResponse = { success: true, data: { id: 1 } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const onSuccess = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(
      () =>
        useFormSubmit({
          onSuccess,
          successMessage: 'Form submitted successfully',
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.submitForm('/api/test', { name: 'Test' });
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Test' }),
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
    expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    expect(mockToast.success).toHaveBeenCalledWith('Form submitted successfully');
  });

  test('handles form submission error', async () => {
    const errorMessage = 'Validation failed';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: errorMessage } }),
    });

    const onError = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(
      () =>
        useFormSubmit({
          onError,
          errorMessage: 'Custom error message',
        }),
      { wrapper }
    );

    await act(async () => {
      try {
        await result.current.submitForm('/api/test', { name: 'Test' });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(onError).toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith('Custom error message');
  });

  test('uses different HTTP methods', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useFormSubmit());

    await act(async () => {
      await result.current.submitForm('/api/test', { name: 'Test' }, 'PUT');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Test' }),
    });
  });

  test('reset function clears state', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useFormSubmit());

    await act(async () => {
      await result.current.submitForm('/api/test', { name: 'Test' });
    });

    expect(result.current.data).toEqual(mockResponse);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});