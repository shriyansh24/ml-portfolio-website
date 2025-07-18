/**
 * Media Utilities for File Storage and Management
 * This file contains utilities for handling file uploads, storage, and retrieval using Vercel Blob
 */

import { put, del, list, head } from '@vercel/blob';

// Define allowed file types
export const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "text/markdown",
];

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Media file metadata interface
 */
export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
  category: string;
  alt?: string;
  caption?: string;
}

/**
 * Upload a file to Vercel Blob storage
 * @param file File to upload
 * @param options Upload options
 * @returns Uploaded file metadata
 */
export async function uploadFile(
  file: File,
  options: {
    category?: string;
    alt?: string;
    caption?: string;
  } = {}
): Promise<MediaFile> {
  // Validate file type
  if (!allowedFileTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the limit (5MB)`);
  }

  // Generate a unique filename with original extension
  const fileExtension = file.name.split('.').pop();
  const timestamp = new Date().getTime();
  const uniqueFilename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
  
  // Upload to Vercel Blob
  const { url, pathname } = await put(uniqueFilename, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: true,
  });

  // Create media file metadata
  const mediaFile: MediaFile = {
    id: pathname.split('/').pop() || '',
    filename: uniqueFilename,
    url,
    contentType: file.type,
    size: file.size,
    uploadedAt: new Date(),
    category: options.category || 'general',
    alt: options.alt,
    caption: options.caption,
  };

  return mediaFile;
}

/**
 * Delete a file from Vercel Blob storage
 * @param url URL of the file to delete
 * @returns True if deletion was successful
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    await del(url);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * List all files in Vercel Blob storage
 * @param options Listing options
 * @returns List of files
 */
export async function listFiles(options: {
  prefix?: string;
  limit?: number;
  cursor?: string;
} = {}): Promise<{
  files: MediaFile[];
  cursor?: string;
  hasMore: boolean;
}> {
  const { blobs, cursor } = await list({
    prefix: options.prefix,
    limit: options.limit || 100,
    cursor: options.cursor,
  });

  // Map blobs to MediaFile format
  const files = blobs.map(blob => ({
    id: blob.pathname.split('/').pop() || '',
    filename: blob.pathname.split('/').pop() || '',
    url: blob.url,
    contentType: blob.contentType || '',
    size: blob.size,
    uploadedAt: new Date(blob.uploadedAt),
    category: 'general', // Default category as we don't store this in Vercel Blob
    alt: '',
    caption: '',
  }));

  return {
    files,
    cursor,
    hasMore: !!cursor,
  };
}

/**
 * Get file metadata from Vercel Blob storage
 * @param url URL of the file
 * @returns File metadata or null if not found
 */
export async function getFileMetadata(url: string): Promise<{
  contentType: string;
  size: number;
  uploadedAt: Date;
} | null> {
  try {
    const metadata = await head(url);
    if (!metadata) return null;
    
    return {
      contentType: metadata.contentType || '',
      size: metadata.size,
      uploadedAt: new Date(metadata.uploadedAt),
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
}