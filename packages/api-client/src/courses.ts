import { getSupabase } from './supabase'
import type { Course, CourseListParams, ApiResponse, PaginatedResponse } from '@therabrake/shared-types'

export class CoursesAPI {
  /**
   * Get list of courses
   */
  static async getCourses(params?: CourseListParams): Promise<ApiResponse<PaginatedResponse<Course>>> {
    const supabase = getSupabase()
    
    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .eq('status', 'published')

    // Apply filters
    if (params?.category) {
      query = query.eq('category', params.category)
    }
    if (params?.level) {
      query = query.eq('level', params.level)
    }
    if (params?.search) {
      query = query.ilike('title', `%${params.search}%`)
    }

    // Pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: {
        data: data as Course[],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    }
  }

  /**
   * Get single course by ID
   */
  static async getCourseById(id: string): Promise<ApiResponse<Course>> {
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('courses')
      .select('*, modules(*, lessons(*))')
      .eq('id', id)
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: data as Course,
    }
  }

  /**
   * Get user's enrolled courses
   */
  static async getEnrolledCourses(userId: string): Promise<ApiResponse<Course[]>> {
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('enrollments')
      .select('course_id, courses(*)')
      .eq('user_id', userId)
      .eq('status', 'active')

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: data.map((enrollment: any) => enrollment.courses) as Course[],
    }
  }

  /**
   * Enroll in a course
   */
  static async enrollInCourse(userId: string, courseId: string): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        progress: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data,
    }
  }
}

export const coursesAPI = CoursesAPI
