import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/search/search-service';
import { SearchFilters } from '@/lib/search/types';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 100) {
    return false;
  }
  
  limit.count++;
  return true;
}

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50
    const sortBy = (searchParams.get('sortBy') || 'relevance') as any;
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    
    // Extract filters
    const filters: SearchFilters = {};
    
    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')!;
    }
    if (searchParams.get('minPrice')) {
      filters.minPrice = parseFloat(searchParams.get('minPrice')!);
    }
    if (searchParams.get('maxPrice')) {
      filters.maxPrice = parseFloat(searchParams.get('maxPrice')!);
    }
    if (searchParams.get('minCeHours')) {
      filters.minCeHours = parseFloat(searchParams.get('minCeHours')!);
    }
    if (searchParams.get('maxCeHours')) {
      filters.maxCeHours = parseFloat(searchParams.get('maxCeHours')!);
    }
    if (searchParams.get('texasApproved')) {
      filters.texasApproved = searchParams.get('texasApproved') === 'true';
    }
    if (searchParams.get('instructorId')) {
      filters.instructorId = searchParams.get('instructorId')!;
    }

    // Perform search
    const results = await searchService.searchCourses(
      query,
      filters,
      { page, limit, sortBy, sortOrder }
    );

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
