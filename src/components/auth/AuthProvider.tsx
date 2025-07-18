'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { AuthContextType, AuthState, LoginFormData } from '@/types/auth';
import { SESSION_TIMEOUT } from '@/lib/auth';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Session timeout tracking
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  
  // Update auth state when session changes
  useEffect(() => {
    if (status === 'loading') {
      setAuthState({ ...authState, loading: true });
      return;
    }
    
    if (session && session.user) {
      setAuthState({
        isAuthenticated: true,
        user: session.user as any,
        loading: false,
        error: null,
      });
      // Reset last activity when session is confirmed
      setLastActivity(Date.now());
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  }, [session, status]);
  
  // Session timeout monitoring
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    
    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const updateActivity = () => {
      setLastActivity(Date.now());
    };
    
    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    // Check for session timeout every minute
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        // Session timeout - log out the user
        handleLogout();
        router.push('/login?timeout=true');
      }
    }, 60000); // Check every minute
    
    return () => {
      // Clean up event listeners and interval
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
    };
  }, [authState.isAuthenticated, lastActivity, router]);
  
  // Login function
  const handleLogin = async (formData: LoginFormData) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        setAuthState({
          ...authState,
          loading: false,
          error: 'Invalid email or password',
        });
        return false;
      }
      
      // Login successful - will be updated by the session effect
      return true;
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: 'An error occurred during login',
      });
      return false;
    }
  };
  
  // Logout function
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Check session validity
  const checkSession = async () => {
    try {
      // This will trigger the useSession hook to update
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      return !!data?.user;
    } catch (error) {
      console.error('Session check error:', error);
      return false;
    }
  };
  
  // Context value
  const contextValue: AuthContextType = {
    ...authState,
    login: handleLogin,
    logout: handleLogout,
    checkSession,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};