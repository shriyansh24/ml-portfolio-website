import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

/**
 * GET /api/papers/categories
 * Get all unique categories used in research papers
 */
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('researchPapers');
    
    // Use MongoDB aggregation to get unique categories
    const categoriesAgg = await collection.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories' } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // Extract category names from aggregation result
    const categories = categoriesAgg.map(item => item._id);
    
    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching paper categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch paper categories' },
      { status: 500 }
    );
  }
}