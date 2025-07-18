import { NextRequest, NextResponse } from "next/server";
import { BlogPostsDB } from "@/lib/dbUtils";

export async function GET(request: NextRequest) {
  try {
    // Get all blog posts
    const result = await BlogPostsDB.getAll({ limit: 1000 });
    const posts = result.posts;
    
    // Extract unique tags
    const tagsSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagsSet.add(tag);
      });
    });
    
    // Convert to array and sort alphabetically
    const tags = Array.from(tagsSet).sort();
    
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog tags" },
      { status: 500 }
    );
  }
}