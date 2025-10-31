import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { CourseFilters, CourseSearchResult } from '@/types/catalog';

const courseSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  content: z.string(),
  ce_hours: z.number().min(0.5),
  provider_number: z.string().optional(),
  modules: z.array(z.any()),
  quiz: z.array(z.any())
});

// GET /api/courses - List and filter courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();
    
    // Parse filters from query params
    const filters: CourseFilters = {
      category: searchParams.get('category') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
      ceHoursMin: searchParams.get('ceHoursMin') ? parseFloat(searchParams.get('ceHoursMin')!) : undefined,
      ceHoursMax: searchParams.get('ceHoursMax') ? parseFloat(searchParams.get('ceHoursMax')!) : undefined,
      difficultyLevel: searchParams.get('difficulty') as any,
      ratingMin: searchParams.get('ratingMin') ? parseFloat(searchParams.get('ratingMin')!) : undefined,
      status: (searchParams.get('status') as any) || 'all',
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12,
    };

    // Build query
    let query = supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles!instructor_id(id, full_name, bio, avatar_url),
        tags:course_tag_relations(tag:course_tags(*))
      `, { count: 'exact' });

    // Apply status filter
    if (filters.status === 'published') {
      query = query.eq('status', 'published').eq('coming_soon', false);
    } else if (filters.status === 'coming_soon') {
      query = query.eq('coming_soon', true);
    } else {
      // Show published and coming soon, not drafts
      query = query.eq('status', 'published');
    }

    // Apply category filter
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Apply price filters
    if (filters.priceMin !== undefined) {
      query = query.gte('price', filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      query = query.lte('price', filters.priceMax);
    }

    // Apply CE hours filters
    if (filters.ceHoursMin !== undefined) {
      query = query.gte('ce_hours', filters.ceHoursMin);
    }
    if (filters.ceHoursMax !== undefined) {
      query = query.lte('ce_hours', filters.ceHoursMax);
    }

    // Apply difficulty filter
    if (filters.difficultyLevel) {
      query = query.eq('difficulty_level', filters.difficultyLevel);
    }

    // Apply rating filter
    if (filters.ratingMin !== undefined) {
      query = query.gte('average_rating', filters.ratingMin);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        query = query.order('total_enrollments', { ascending: false });
        break;
      case 'rating':
        query = query.order('average_rating', { ascending: false });
        break;
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
      case 'title':
        query = query.order('title', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const from = (filters.page! - 1) * filters.limit!;
    const to = from + filters.limit! - 1;
    query = query.range(from, to);

    const { data: courses, error, count } = await query;

    if (error) throw error;

    // Filter by tags if needed (post-query due to many-to-many)
    let filteredCourses = courses || [];
    if (filters.tags && filters.tags.length > 0) {
      filteredCourses = filteredCourses.filter(course => {
        const courseTags = course.tags?.map((t: any) => t.tag.slug) || [];
        return filters.tags!.some(tag => courseTags.includes(tag));
      });
    }

    // Format response
    const result: CourseSearchResult = {
      courses: filteredCourses.map(course => ({
        ...course,
        tags: course.tags?.map((t: any) => t.tag) || [],
      })),
      total: count || 0,
      page: filters.page!,
      limit: filters.limit!,
      totalPages: Math.ceil((count || 0) / filters.limit!),
      filters,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Course fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = courseSchema.parse(body);
    const supabase = await createClient();
    
    // Create course
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title: validated.title,
        description: validated.description,
        ce_hours: validated.ce_hours,
        provider_number: validated.provider_number,
        status: 'draft'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Create modules
    if (validated.modules.length > 0) {
      await supabase
        .from('modules')
        .insert(
          validated.modules.map((m: any, idx: number) => ({
            course_id: course.id,
            title: m.title,
            content: m.content,
            order_index: idx
          }))
        );
    }
    
    // Create quiz
    if (validated.quiz.length > 0) {
      const { data: quizData } = await supabase
        .from('quizzes')
        .insert({
          course_id: course.id,
          title: `${validated.title} Assessment`,
          passing_score: 70
        })
        .select()
        .single();
        
      if (quizData) {
        await supabase
          .from('quiz_questions')
          .insert(
            validated.quiz.map((q: any, idx: number) => ({
              quiz_id: quizData.id,
              question: q.question,
              answers: q.answers,
              correct_answer: q.correct,
              explanation: q.explanation,
              order_index: idx
            }))
          );
      }
    }
    
    return NextResponse.json({ success: true, courseId: course.id });
  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
