import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { BlogPostsDB } from "@/lib/dbUtils";
import { generateSlug } from "@/lib/utils";
import { createErrorResponse, withErrorHandler, createValidationError, ErrorCode, HTTP_STATUS } from "@/lib/appRouteErrorUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const id = params.id;
    const post = await BlogPostsDB.getById(id);
    
    if (!post) {
      return createErrorResponse(
        HTTP_STATUS.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        "Blog post not found"
      );
    }

    return NextResponse.json(post);
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return createErrorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
        "You must be logged in as an admin to update blog posts"
      );
    }

    const id = params.id;
    const data = await request.json();
    
    // Validate required fields
    if (data.title && data.title.trim() === '') {
      throw createValidationError("Title cannot be empty");
    }
    
    // Check if post exists
    const existingPost = await BlogPostsDB.getById(id);
    if (!existingPost) {
      return createErrorResponse(
        HTTP_STATUS.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        "Blog post not found"
      );
    }
    
    // Generate slug if title changed and slug not provided
    if (data.title && data.title !== existingPost.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }
    
    // Always update the updatedAt timestamp
    data.updatedAt = new Date();
    
    // Update SEO metadata if title or excerpt changed
    if ((data.title || data.excerpt) && !data.seoMetadata) {
      data.seoMetadata = {
        ...existingPost.seoMetadata,
        title: data.title || existingPost.title,
        description: data.excerpt || existingPost.excerpt,
      };
      
      if (data.tags) {
        data.seoMetadata.keywords = data.tags;
      }
    }
    
    // Update the blog post
    const updatedPost = await BlogPostsDB.update(id, data);
    
    return NextResponse.json({
      message: "Blog post updated successfully",
      post: updatedPost
    });
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return createErrorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
        "You must be logged in as an admin to delete blog posts"
      );
    }

    const id = params.id;
    
    // Check if post exists
    const existingPost = await BlogPostsDB.getById(id);
    if (!existingPost) {
      return createErrorResponse(
        HTTP_STATUS.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        "Blog post not found"
      );
    }
    
    // Delete the blog post
    const deleted = await BlogPostsDB.delete(id);
    
    if (!deleted) {
      return createErrorResponse(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Failed to delete blog post"
      );
    }
    
    return NextResponse.json({
      message: "Blog post deleted successfully"
    });
  });
}