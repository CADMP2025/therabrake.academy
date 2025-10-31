import { getSupabase } from './supabase'
import type { UpdateProgressRequest, VideoProgressRequest, ApiResponse } from '@therabrake/shared-types'

export class ProgressAPI {
  /**
   * Update lesson progress
   */
  static async updateProgress(params: UpdateProgressRequest): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        lesson_id: params.lessonId,
        course_id: params.courseId,
        completed: params.completed || false,
        time_spent: params.timeSpent || 0,
        last_position: params.lastPosition,
        updated_at: new Date().toISOString(),
      })
      .select()

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

  /**
   * Update video progress
   */
  static async updateVideoProgress(params: VideoProgressRequest): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const { data, error } = await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        lesson_id: params.lessonId,
        course_id: params.courseId,
        last_position: params.currentTime,
        time_spent: Math.floor(params.currentTime),
        completed: params.completed || false,
        updated_at: new Date().toISOString(),
      })
      .select()

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

  /**
   * Get progress for a course
   */
  static async getCourseProgress(userId: string, courseId: string): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)

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

export const progressAPI = ProgressAPI
