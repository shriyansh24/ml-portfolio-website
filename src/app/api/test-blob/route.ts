import { NextRequest, NextResponse } from "next/server";
import { put, list } from '@vercel/blob';

/**
 * GET /api/test-blob
 * Test Vercel Blob configuration by listing blobs
 */
export async function GET(request: NextRequest) {
  try {
    // List blobs to test configuration
    const { blobs } = await list();
    
    return NextResponse.json({
      message: "Vercel Blob is configured correctly",
      blobCount: blobs.length,
      blobs: blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      }))
    });
  } catch (error) {
    console.error("Error testing Vercel Blob:", error);
    return NextResponse.json(
      { 
        error: "Failed to test Vercel Blob configuration",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/test-blob
 * Test Vercel Blob configuration by uploading a test blob
 */
export async function POST(request: NextRequest) {
  try {
    // Create a simple test blob
    const testContent = "This is a test blob to verify Vercel Blob configuration";
    const testBlob = new Blob([testContent], { type: "text/plain" });
    
    // Upload the test blob
    const { url, pathname } = await put(`test-${Date.now()}.txt`, testBlob, {
      access: 'public',
    });
    
    return NextResponse.json({
      message: "Test blob uploaded successfully",
      url,
      pathname
    });
  } catch (error) {
    console.error("Error testing Vercel Blob upload:", error);
    return NextResponse.json(
      { 
        error: "Failed to upload test blob",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}