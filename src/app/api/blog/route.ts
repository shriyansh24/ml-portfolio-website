import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { BlogPostsDB } from "@/lib/dbUtils";
import { BlogPost } from "@/types/models";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const tag = searchParams.get("tag") || undefined;
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    
    const result = await BlogPostsDB.getAll({
      limit,
      skip: (page - 1) * limit,
      tag,
      featured,
      sortBy: "publishedAt",
      sortOrder: "desc"
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }
    
    // Ensure required fields
    if (!data.title || !data.content || !data.excerpt) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, excerpt" },
        { status: 400 }
      );
    }
    
    // Set default values if not provided
    const blogPost: Omit<BlogPost, "id"> = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      updatedAt: new Date(),
      tags: data.tags || [],
      featured: data.featured || false,
      seoMetadata: data.seoMetadata || {
        title: data.title,
        description: data.excerpt,
        keywords: data.tags || []
      }
    };
    
    // Create blog post in database
    const createdPost = await BlogPostsDB.create(blogPost);
    
    return NextResponse.json(
      { message: "Blog post created successfully", post: createdPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}