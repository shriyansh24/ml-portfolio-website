import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { uploadFile, allowedFileTypes, MAX_FILE_SIZE } from "@/lib/mediaUtils";
import { MediaFilesDB } from "@/lib/dbUtils";

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

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string || "general";
    const alt = formData.get("alt") as string || "";
    const caption = formData.get("caption") as string || "";
    const tags = formData.get("tags") as string || "";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the limit (5MB)" },
        { status: 400 }
      );
    }

    try {
      // Upload file to Vercel Blob
      const mediaFile = await uploadFile(file, {
        category,
        alt,
        caption
      });
      
      // Add tags if provided
      if (tags) {
        mediaFile.tags = tags.split(',').map(tag => tag.trim());
      }
      
      // Save media file metadata to database
      const savedFile = await MediaFilesDB.create(mediaFile);
      
      return NextResponse.json({
        message: "File uploaded successfully",
        file: savedFile
      });
    } catch (error) {
      console.error("Error saving file:", error);
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}