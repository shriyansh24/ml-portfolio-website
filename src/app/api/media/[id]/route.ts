import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { MediaFilesDB } from "@/lib/dbUtils";
import { deleteFile } from "@/lib/mediaUtils";

/**
 * GET /api/media/[id]
 * Get a specific media file by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const mediaFile = await MediaFilesDB.getById(id);

    if (!mediaFile) {
      return NextResponse.json(
        { error: "Media file not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(mediaFile);
  } catch (error) {
    console.error("Error getting media file:", error);
    return NextResponse.json(
      { error: "Failed to get media file" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/media/[id]
 * Update a media file's metadata
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = params.id;
    const data = await request.json();

    // Check if media file exists
    const existingFile = await MediaFilesDB.getById(id);
    if (!existingFile) {
      return NextResponse.json(
        { error: "Media file not found" },
        { status: 404 }
      );
    }

    // Update media file metadata
    const updatedFile = await MediaFilesDB.update(id, {
      alt: data.alt,
      caption: data.caption,
      category: data.category,
      tags: data.tags,
    });

    return NextResponse.json({
      message: "Media file updated successfully",
      file: updatedFile,
    });
  } catch (error) {
    console.error("Error updating media file:", error);
    return NextResponse.json(
      { error: "Failed to update media file" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media/[id]
 * Delete a media file and its metadata
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = params.id;

    // Get media file to get the URL for deletion
    const mediaFile = await MediaFilesDB.getById(id);
    if (!mediaFile) {
      return NextResponse.json(
        { error: "Media file not found" },
        { status: 404 }
      );
    }

    // Delete the file from Vercel Blob
    const deleted = await deleteFile(mediaFile.url);
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete file from storage" },
        { status: 500 }
      );
    }

    // Delete the metadata from the database
    await MediaFilesDB.delete(id);

    return NextResponse.json({
      message: "Media file deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting media file:", error);
    return NextResponse.json(
      { error: "Failed to delete media file" },
      { status: 500 }
    );
  }
}