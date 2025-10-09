import { meiliServerClient, COURSES_INDEX } from './meilisearch-client';
import { CourseSearchDocument, SearchOptions, SearchFilters } from './types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildFilterString(filters?: SearchFilters): string {
  const filterParts: string[] = ['is_published = true'];

  if (filters) {
    if (filters.category) {
      filterParts.push(`category = "${filters.category}"`);
    }
    if (filters.minCEHours !== undefined) {
      filterParts.push(`ce_hours >= ${filters.minCEHours}`);
    }
    if (filters.maxCEHours !== undefined) {
      filterParts.push(`ce_hours <= ${filters.maxCEHours}`);
    }
    if (filters.minPrice !== undefined) {
      filterParts.push(`price >= ${filters.minPrice}`);
    }
    if (filters.maxPrice !== undefined) {
      filterParts.push(`price <= ${filters.maxPrice}`);
    }
    if (filters.level) {
      filterParts.push(`level = "${filters.level}"`);
    }
    if (filters.texasApproved !== undefined) {
      filterParts.push(`texas_approved = ${filters.texasApproved}`);
    }
  }

  return filterParts.join(' AND ');
}

export const searchService = {
  async searchCourses(options: SearchOptions) {
    try {
      const index = meiliServerClient.index<CourseSearchDocument>(COURSES_INDEX);
      
      const searchParams: any = {
        limit: options.limit || 20,
        offset: options.offset || 0,
        filter: buildFilterString(options.filters),
      };

      if (options.sort && options.sort.length > 0) {
        searchParams.sort = options.sort;
      }

      const results = await index.search(options.query, searchParams);

      return {
        success: true,
        hits: results.hits,
        estimatedTotalHits: results.estimatedTotalHits,
        processingTimeMs: results.processingTimeMs,
        query: results.query,
      };
    } catch (error: any) {
      console.error('Search failed:', error);
      return {
        success: false,
        error: error.message,
        hits: [],
        estimatedTotalHits: 0,
      };
    }
  },

  async indexCourse(courseId: string) {
    try {
      // Fetch course data from Supabase
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          ce_hours,
          price,
          category,
          level,
          is_published,
          texas_approved,
          thumbnail_url,
          created_at,
          updated_at,
          instructor:users(full_name)
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      if (!course) throw new Error('Course not found');

      // Get enrollment count
      const { count: enrollmentCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

      // Get average rating (placeholder - implement when reviews are added)
      const averageRating = 0;

      // Create search document
      const searchDoc: CourseSearchDocument = {
        id: course.id,
        title: course.title,
        description: course.description || '',
        instructor_name: course.instructor?.full_name || 'Unknown',
        ce_hours: course.ce_hours,
        price: course.price,
        category: course.category,
        level: course.level,
        is_published: course.is_published,
        texas_approved: course.texas_approved,
        enrollment_count: enrollmentCount || 0,
        average_rating: averageRating,
        created_at: new Date(course.created_at).getTime(),
        updated_at: new Date(course.updated_at).getTime(),
        thumbnail_url: course.thumbnail_url,
      };

      // Index in Meilisearch
      const index = meiliServerClient.index<CourseSearchDocument>(COURSES_INDEX);
      await index.addDocuments([searchDoc]);

      console.log(`✅ Indexed course: ${course.title}`);
      return { success: true };
    } catch (error: any) {
      console.error(`Failed to index course ${courseId}:`, error);
      return { success: false, error: error.message };
    }
  },

  async removeCourse(courseId: string) {
    try {
      const index = meiliServerClient.index<CourseSearchDocument>(COURSES_INDEX);
      await index.deleteDocument(courseId);
      console.log(`✅ Removed course from index: ${courseId}`);
      return { success: true };
    } catch (error: any) {
      console.error(`Failed to remove course ${courseId}:`, error);
      return { success: false, error: error.message };
    }
  },

  async reindexAllCourses() {
    try {
      // Fetch all published courses
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          ce_hours,
          price,
          category,
          level,
          is_published,
          texas_approved,
          thumbnail_url,
          created_at,
          updated_at,
          instructor:users(full_name)
        `)
        .eq('is_published', true);

      if (error) throw error;
      if (!courses || courses.length === 0) {
        console.log('No courses to index');
        return { success: true, indexed: 0 };
      }

      // Get enrollment counts for all courses
      const courseIds = courses.map(c => c.id);
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .in('course_id', courseIds);

      const enrollmentCounts = enrollments?.reduce((acc, enrollment) => {
        acc[enrollment.course_id] = (acc[enrollment.course_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Create search documents
      const searchDocs: CourseSearchDocument[] = courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        instructor_name: course.instructor?.full_name || 'Unknown',
        ce_hours: course.ce_hours,
        price: course.price,
        category: course.category,
        level: course.level,
        is_published: course.is_published,
        texas_approved: course.texas_approved,
        enrollment_count: enrollmentCounts[course.id] || 0,
        average_rating: 0,
        created_at: new Date(course.created_at).getTime(),
        updated_at: new Date(course.updated_at).getTime(),
        thumbnail_url: course.thumbnail_url,
      }));

      // Index all documents
      const index = meiliServerClient.index<CourseSearchDocument>(COURSES_INDEX);
      await index.addDocuments(searchDocs);

      console.log(`✅ Reindexed ${searchDocs.length} courses`);
      return { success: true, indexed: searchDocs.length };
    } catch (error: any) {
      console.error('Failed to reindex courses:', error);
      return { success: false, error: error.message };
    }
  },
};
