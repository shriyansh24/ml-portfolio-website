import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MediaFile } from '@/types/models';

interface MediaManagerProps {
  onSelect?: (file: MediaFile) => void;
  selectable?: boolean;
  maxHeight?: string;
}

export default function MediaManager({ onSelect, selectable = false, maxHeight = '600px' }: MediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState({
    category: '',
    search: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [formData, setFormData] = useState({
    alt: '',
    caption: '',
    category: 'general',
    tags: '',
  });

  const router = useRouter();

  // Fetch media files
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', '20');
      
      if (filter.category) {
        searchParams.append('category', filter.category);
      }
      
      if (filter.search) {
        searchParams.append('search', filter.search);
      }
      
      const response = await fetch(`/api/media?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch media files');
      }
      
      const data = await response.json();
      setFiles(data.files);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFiles();
  }, [page, filter]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general');
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const data = await response.json();
      
      // Refresh the file list
      fetchFiles();
      
      setUploading(false);
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file selection
  const handleFileSelect = (file: MediaFile) => {
    if (selectable) {
      setSelectedFile(file);
      if (onSelect) {
        onSelect(file);
      }
    } else {
      setEditingFile(file);
      setFormData({
        alt: file.alt || '',
        caption: file.caption || '',
        category: file.category || 'general',
        tags: file.tags?.join(', ') || '',
      });
    }
  };

  // Handle file deletion
  const handleFileDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }
      
      // Refresh the file list
      fetchFiles();
      
      if (editingFile?.id === id) {
        setEditingFile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file update
  const handleFileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile) return;
    
    try {
      const response = await fetch(`/api/media/${editingFile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }
      
      // Refresh the file list
      fetchFiles();
      
      setEditingFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  // Render file preview based on type
  const renderFilePreview = (file: MediaFile) => {
    if (file.contentType.startsWith('image/')) {
      return (
        <div className="relative w-full h-32 bg-gray-100">
          <Image
            src={file.url}
            alt={file.alt || file.filename}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      );
    } else if (file.contentType === 'application/pdf') {
      return (
        <div className="flex items-center justify-center w-full h-32 bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-full h-32 bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Media Manager</h2>
        <p className="text-gray-600">Upload and manage media files</p>
      </div>
      
      {/* Filters and upload */}
      <div className="p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="blog">Blog</option>
            <option value="project">Project</option>
            <option value="research">Research</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search files..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload New File</label>
          <input
            type="file"
            className="w-full"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4" style={{ maxHeight, overflowY: 'auto' }}>
        {loading ? (
          <div className="col-span-full flex justify-center p-8">
            <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : files.length === 0 ? (
          <div className="col-span-full text-center p-8">
            <p className="text-gray-500">No media files found</p>
          </div>
        ) : (
          files.map(file => (
            <div
              key={file.id}
              className={`border rounded-lg overflow-hidden ${selectedFile?.id === file.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleFileSelect(file)}
            >
              {renderFilePreview(file)}
              <div className="p-2">
                <p className="text-sm font-medium truncate" title={file.filename}>{file.filename}</p>
                <p className="text-xs text-gray-500">{file.category} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(file.url);
                      alert('URL copied to clipboard!');
                    }}
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileDelete(file.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              type="button"
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="px-3 py-1 border rounded-md disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </nav>
        </div>
      )}
      
      {/* Edit modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Media File</h3>
            
            <form onSubmit={handleFileUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  name="alt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.alt}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <textarea
                  name="caption"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={formData.caption}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="general">General</option>
                  <option value="blog">Blog</option>
                  <option value="project">Project</option>
                  <option value="research">Research</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  onClick={() => setEditingFile(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}