import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }
  
  return {
    ...session.user,
    role: (session.user as any).role || 'user',
  };
}

export function isAdmin(user: any) {
  return user?.role === 'admin';
}

// Session timeout in milliseconds (1 hour)
export const SESSION_TIMEOUT = 60 * 60 * 1000;