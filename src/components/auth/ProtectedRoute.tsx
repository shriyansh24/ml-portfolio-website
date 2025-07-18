'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  adminOnly = true 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Wait until authentication state is determined
    if (loading) return;
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // Check admin access if required
    if (adminOnly && user?.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, loading, adminOnly, router]);
  
  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  // Show nothing if not authenticated or not admin (when required)
  if (!isAuthenticated || (adminOnly && user?.role !== 'admin')) {
    return null;
  }
  
  // Render children if authenticated and has proper permissions
  return <>{children}</>;
};