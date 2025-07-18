import { NextRequest, NextResponse } from "next/server";
import { BlogPostsDB } from "@/lib/dbUtils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    
    if (!query) {
      return NextResponse.json(
        { error: "Missing required parameter: q" },
        { status: 400 }
      );
    }
    
    // Use the database search function
    const result = await BlogPostsDB.search(query, {
      limit,
      skip: (page - 1) * limit
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to search blog posts" },
      { status: 500 }
    );
  }
}