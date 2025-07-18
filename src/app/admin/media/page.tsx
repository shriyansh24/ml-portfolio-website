import React from 'react';
import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MediaManager from '@/components/media/MediaManager';

export const metadata: Metadata = {
  title: 'Media Management | Admin',
  description: 'Manage media files for your portfolio website',
};

export default function MediaManagementPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Media Management</h1>
        <MediaManager maxHeight="800px" />
      </div>
    </ProtectedRoute>
  );
}