import { NextRequest, NextResponse } from "next/server";
import { BlogPostsDB } from "@/lib/dbUtils";
import { findRelatedPosts } from "@/lib/searchUtils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const limit = parseInt(searchParams.get("limit") || "3");
    
    if (!postId) {
      return NextResponse.json(
        { error: "Missing required parameter: postId" },
        { status: 400 }
      );
    }
    
    // Get the current post
    const currentPost = await BlogPostsDB.getById(postId);
    
    if (!currentPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    
    // Get all posts to find related ones
    const allPostsResult = await BlogPostsDB.getAll({ limit: 100 });
    const allPosts = allPostsResult.posts;
    
    // Find related posts
    const relatedPosts = findRelatedPosts(currentPost, allPosts, limit);
    
    return NextResponse.json({ relatedPosts });
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch related posts" },
      { status: 500 }
    );
  }
}