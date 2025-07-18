import React, { useState } from 'react';
import Image from 'next/image';
import { MediaFile } from '@/types/models';
import MediaManager from './MediaManager';

interface MediaSelectorProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  preview?: boolean;
}

export default function MediaSelector({ value, onChange, label = 'Select Media', preview = true }: MediaSelectorProps) {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(value || '');

  const handleSelect = (file: MediaFile) => {
    setSelectedUrl(file.url);
    onChange(file.url);
    setShowSelector(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          value={selectedUrl}
          onChange={(e) => {
            setSelectedUrl(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Media URL"
        />
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setShowSelector(true)}
        >
          Browse
        </button>
      </div>
      
      {preview && selectedUrl && selectedUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) && (
        <div className="mt-2 relative h-40 bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={selectedUrl}
            alt="Selected media"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain"
          />
        </div>
      )}
      
      {showSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Media</h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowSelector(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <MediaManager onSelect={handleSelect} selectable={true} maxHeight="500px" />
          </div>
        </div>
      )}
    </div>
  );
}