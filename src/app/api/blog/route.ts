import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    // This would be replaced with actual database queries
    const mockBlogPosts = [
      {
        id: "1",
        title: "Introduction to Transformer Models",
        slug: "introduction-to-transformer-models",
        excerpt: "An overview of transformer architecture and its applications in NLP.",
        publishedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json(mockBlogPosts);
  } catch (error) {
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
    
    // This would be replaced with actual database operations
    
    return NextResponse.json(
      { message: "Blog post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}