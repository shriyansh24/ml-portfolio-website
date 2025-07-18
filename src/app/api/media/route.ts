import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MediaFilesDB } from "@/lib/dbUtils";

/**
 * GET /api/media
 * List all media files with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    const category = searchParams.get("category") || undefined;
    const contentType = searchParams.get("contentType") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const sortBy = searchParams.get("sortBy") || "uploadedAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const search = searchParams.get("search") || undefined;

    // If search parameter is provided, use search function
    if (search) {
      const result = await MediaFilesDB.search(search, { limit, skip });
      return NextResponse.json(result);
    }

    // Otherwise, use getAll with filters
    const result = await MediaFilesDB.getAll({
      limit,
      skip,
      category,
      contentType,
      tag,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error listing media files:", error);
    return NextResponse.json(
      { error: "Failed to list media files" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media
 * Create a new media file record (metadata only, actual file upload is handled by /api/upload)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.url || !data.filename || !data.contentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create media file record
    const mediaFile = await MediaFilesDB.create({
      ...data,
      uploadedAt: data.uploadedAt || new Date(),
      category: data.category || "general",
    });

    return NextResponse.json({
      message: "Media file record created successfully",
      file: mediaFile,
    });
  } catch (error) {
    console.error("Error creating media file record:", error);
    return NextResponse.json(
      { error: "Failed to create media file record" },
      { status: 500 }
    );
  }
}