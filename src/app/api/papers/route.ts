import { NextRequest, NextResponse } from 'next/server';
import { ResearchPapersDB } from '@/lib/dbUtils';
import { ResearchPaper } from '@/types/models';
import { getServerSession } from '@/lib/auth';

/**
 * GET /api/papers
 * Get all research papers with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    const category = searchParams.get('category') || '';
    const topic = searchParams.get('topic') || '';
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'publicationDate';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    
    const options: any = { limit, skip, sortBy, sortOrder };
    
    // Apply filters if provided
    if (category) options.category = category;
    if (topic) options.topic = topic;
    if (search) options.search = search;
    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    
    const result = await ResearchPapersDB.getAll(options);
    
    return NextResponse.json({
      success: true,
      papers: result.papers,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    });
  } catch (error) {
    console.error('Error fetching research papers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch research papers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/papers
 * Create a new research paper (authenticated)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'authors', 'abstract', 'publicationDate', 'venue', 'categories'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Ensure authors and categories are arrays
    if (!Array.isArray(data.authors) || !Array.isArray(data.categories)) {
      return NextResponse.json(
        { success: false, error: 'Authors and categories must be arrays' },
        { status: 400 }
      );
    }
    
    // Ensure keyFindings is an array if provided
    if (data.keyFindings && !Array.isArray(data.keyFindings)) {
      return NextResponse.json(
        { success: false, error: 'Key findings must be an array' },
        { status: 400 }
      );
    }
    
    // Create the paper
    const paper = await ResearchPapersDB.create({
      title: data.title,
      authors: data.authors,
      abstract: data.abstract,
      publicationDate: new Date(data.publicationDate),
      venue: data.venue,
      doi: data.doi || undefined,
      arxivId: data.arxivId || undefined,
      pdfUrl: data.pdfUrl || undefined,
      categories: data.categories,
      personalAnnotations: data.personalAnnotations || '',
      keyFindings: data.keyFindings || [],
      relevanceScore: data.relevanceScore || 5,
      addedAt: new Date()
    } as Omit<ResearchPaper, 'id'>);
    
    return NextResponse.json({
      success: true,
      paper
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating research paper:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create research paper' },
      { status: 500 }
    );
  }
}