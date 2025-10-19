import { createClient } from '@/lib/supabase/server';
import { SearchFilters, SearchOptions, SearchResponse } from './types';

export class SearchService {
  /**
   * Search courses with filters and options
   */
  async searchCourses(
    query: string,
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): Promise<SearchResponse> {
    const supabase = await createClient();
    
    const {
      page = 1,
      limit = 20,
      sortBy = 'relevance',
      sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;

    // Build the query
    let dbQuery = supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        price,
        ce_hours,
        category,
        texas_approved,
        created_at,
        instructor:users!instructor_id (
          id,
          full_name,
          avatar_url
        ),
        course_reviews (
          rating
        ),
        enrollments (
          count
        )
      `, { count: 'exact' })
      .eq('status', 'published');

    // Apply text search if query provided
    if (query && query.trim()) {
      // Use Postgres full-text search
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
      );
    }

    // Apply filters
    if (filters.category) {
      dbQuery = dbQuery.eq('category', filters.category);
    }
    if (filters.minPrice !== undefined) {
      dbQuery = dbQuery.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      dbQuery = dbQuery.lte('price', filters.maxPrice);
    }
    if (filters.minCeHours !== undefined) {
      dbQuery = dbQuery.gte('ce_hours', filters.minCeHours);
    }
    if (filters.maxCeHours !== undefined) {
      dbQuery = dbQuery.lte('ce_hours', filters.maxCeHours);
    }
    if (filters.texasApproved !== undefined) {
      dbQuery = dbQuery.eq('texas_approved', filters.texasApproved);
    }
    if (filters.instructorId) {
      dbQuery = dbQuery.eq('instructor_id', filters.instructorId);
    }

    // Apply sorting
    if (sortBy === 'relevance' && query) {
      // For relevance, we'll use the default order and calculate later
      dbQuery = dbQuery.order('created_at', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'rating') {
      // We'll need to calculate this from reviews
      dbQuery = dbQuery.order('created_at', { ascending: sortOrder === 'asc' });
    } else if (sortBy === 'enrollment_count') {
      // We'll need to calculate this from enrollments
      dbQuery = dbQuery.order('created_at', { ascending: sortOrder === 'asc' });
    } else {
      dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    // Transform data and calculate metrics
    const results = (data || []).map((course: any) => {
      const reviews = course.course_reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

      const enrollmentCount = course.enrollments?.[0]?.count || 0;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        price: course.price,
        ce_hours: course.ce_hours,
        category: course.category,
        texas_approved: course.texas_approved,
        instructor: course.instructor,
        average_rating: averageRating,
        enrollment_count: enrollmentCount
      };
    });

    // Sort by rating or enrollment if requested
    if (sortBy === 'rating') {
      results.sort((a, b) => 
        sortOrder === 'asc' 
          ? a.average_rating - b.average_rating
          : b.average_rating - a.average_rating
      );
    } else if (sortBy === 'enrollment_count') {
      results.sort((a, b) => 
        sortOrder === 'asc'
          ? a.enrollment_count - b.enrollment_count
          : b.enrollment_count - a.enrollment_count
      );
    }

    return {
      results,
      total: count || 0,
      page,
      limit,
      hasMore: count ? offset + limit < count : false
    };
  }

  /**
   * Get popular courses
   */
  async getPopularCourses(limit: number = 10): Promise<SearchResponse> {
    return this.searchCourses('', {}, {
      limit,
      sortBy: 'enrollment_count',
      sortOrder: 'desc'
    });
  }

  /**
   * Get featured courses (Texas approved with high ratings)
   */
  async getFeaturedCourses(limit: number = 10): Promise<SearchResponse> {
    return this.searchCourses('', {
      texasApproved: true
    }, {
      limit,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  }

  /**
   * Get courses by category
   */
  async getCoursesByCategory(
    category: string,
    options: SearchOptions = {}
  ): Promise<SearchResponse> {
    return this.searchCourses('', { category }, options);
  }
}

// Export singleton instance
export const searchService = new SearchService();
