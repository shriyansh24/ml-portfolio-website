'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import FallbackError from '@/components/error/FallbackError';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<FallbackError error={null} />}>
      <SessionProvider>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}