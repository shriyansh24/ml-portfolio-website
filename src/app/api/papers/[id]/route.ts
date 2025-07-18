import { NextRequest, NextResponse } from "next/server";
import { ResearchPapersDB } from "@/lib/dbUtils";
import { getServerSession } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET /api/papers/[id]
 * Get a research paper by ID
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const paper = await ResearchPapersDB.getById(id);

    if (!paper) {
      return NextResponse.json(
        { success: false, error: "Research paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paper,
    });
  } catch (error) {
    console.error("Error fetching research paper:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch research paper" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/papers/[id]
 * Update a research paper (authenticated)
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Check if paper exists
    const existingPaper = await ResearchPapersDB.getById(id);
    if (!existingPaper) {
      return NextResponse.json(
        { success: false, error: "Research paper not found" },
        { status: 404 }
      );
    }

    // Ensure authors and categories are arrays if provided
    if (data.authors && !Array.isArray(data.authors)) {
      return NextResponse.json(
        { success: false, error: "Authors must be an array" },
        { status: 400 }
      );
    }

    if (data.categories && !Array.isArray(data.categories)) {
      return NextResponse.json(
        { success: false, error: "Categories must be an array" },
        { status: 400 }
      );
    }

    // Ensure keyFindings is an array if provided
    if (data.keyFindings && !Array.isArray(data.keyFindings)) {
      return NextResponse.json(
        { success: false, error: "Key findings must be an array" },
        { status: 400 }
      );
    }

    // Convert publicationDate to Date object if provided
    if (data.publicationDate) {
      data.publicationDate = new Date(data.publicationDate);
    }

    // Update the paper
    const updatedPaper = await ResearchPapersDB.update(id, data);

    return NextResponse.json({
      success: true,
      paper: updatedPaper,
    });
  } catch (error) {
    console.error("Error updating research paper:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update research paper" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/papers/[id]
 * Delete a research paper (authenticated)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if paper exists
    const existingPaper = await ResearchPapersDB.getById(id);
    if (!existingPaper) {
      return NextResponse.json(
        { success: false, error: "Research paper not found" },
        { status: 404 }
      );
    }

    // Delete the paper
    const success = await ResearchPapersDB.delete(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete research paper" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Research paper deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting research paper:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete research paper" },
      { status: 500 }
    );
  }
}
