'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Log Out
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Welcome, {user?.name || user?.email}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You are logged in as an {user?.role}.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AdminCard 
              title="Blog Posts" 
              count={0} 
              link="/admin/blog" 
              icon="📝" 
            />
            <AdminCard 
              title="Research Papers" 
              count={0} 
              link="/admin/research" 
              icon="📚" 
            />
            <AdminCard 
              title="Media Files" 
              count={0} 
              link="/admin/media" 
              icon="🖼️" 
            />
            <AdminCard 
              title="Messages" 
              count={0} 
              link="/admin/messages" 
              icon="✉️" 
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface AdminCardProps {
  title: string;
  count: number;
  link: string;
  icon: string;
}

function AdminCard({ title, count, link, icon }: AdminCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-300">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      <a 
        href={link}
        className="mt-4 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        Manage {title} →
      </a>
    </div>
  );
}