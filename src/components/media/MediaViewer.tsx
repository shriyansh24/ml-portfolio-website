import React from 'react';
import Image from 'next/image';
import { MediaFile } from '@/types/models';

interface MediaViewerProps {
  file: MediaFile;
  onClose?: () => void;
}

export default function MediaViewer({ file, onClose }: MediaViewerProps) {
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render file preview based on content type
  const renderFilePreview = () => {
    if (file.contentType.startsWith('image/')) {
      return (
        <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={file.url}
            alt={file.alt || file.filename}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      );
    } else if (file.contentType === 'application/pdf') {
      return (
        <div className="w-full h-96 bg-gray-100 rounded-md overflow-hidden">
          <iframe
            src={file.url}
            className="w-full h-full"
            title={file.filename}
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-md">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-gray-600">{file.filename}</p>
            <a 
              href={file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Download File
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold truncate" title={file.filename}>
          {file.filename}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {renderFilePreview()}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">File Details</h3>
          <dl className="space-y-1">
            <div className="flex">
              <dt className="w-24 font-medium text-gray-500">Type:</dt>
              <dd>{file.contentType}</dd>
            </div>
            <div className="flex">
              <dt className="w-24 font-medium text-gray-500">Size:</dt>
              <dd>{formatFileSize(file.size)}</dd>
            </div>
            <div className="flex">
              <dt className="w-24 font-medium text-gray-500">Uploaded:</dt>
              <dd>{formatDate(file.uploadedAt)}</dd>
            </div>
            <div className="flex">
              <dt className="w-24 font-medium text-gray-500">Category:</dt>
              <dd>{file.category}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Usage</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Direct URL</label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={file.url}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(file.url);
                    alert('URL copied to clipboard!');
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Markdown</label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={`![${file.alt || file.filename}](${file.url})`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`![${file.alt || file.filename}](${file.url})`);
                    alert('Markdown copied to clipboard!');
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">HTML</label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={`<img src="${file.url}" alt="${file.alt || file.filename}" />`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`<img src="${file.url}" alt="${file.alt || file.filename}" />`);
                    alert('HTML copied to clipboard!');
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(file.alt || file.caption || file.tags) && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Metadata</h3>
          <dl className="space-y-2">
            {file.alt && (
              <div>
                <dt className="font-medium text-gray-500">Alt Text:</dt>
                <dd>{file.alt}</dd>
              </div>
            )}
            {file.caption && (
              <div>
                <dt className="font-medium text-gray-500">Caption:</dt>
                <dd>{file.caption}</dd>
              </div>
            )}
            {file.tags && file.tags.length > 0 && (
              <div>
                <dt className="font-medium text-gray-500">Tags:</dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {file.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}