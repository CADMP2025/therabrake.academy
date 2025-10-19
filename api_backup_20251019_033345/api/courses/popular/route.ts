import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/search/search-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20);

    const results = await searchService.getPopularCourses(limit);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Popular courses API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular courses', details: error.message },
      { status: 500 }
    );
  }
}
