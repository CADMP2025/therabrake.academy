import { getSupabase } from './supabase'
import type { LoginRequest, RegisterRequest, ApiResponse } from '@therabrake/shared-types'

export class AuthAPI {
  /**
   * Sign in with email and password
   */
  static async signIn(credentials: LoginRequest): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    }
  }

  /**
   * Sign up new user
   */
  static async signUp(credentials: RegisterRequest): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
          role: credentials.role,
          phone: credentials.phone,
        },
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: user,
    }
  }

  /**
   * Get current session
   */
  static async getSession(): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: session,
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<ApiResponse> {
    const supabase = getSupabase()
    
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Password reset email sent',
    }
  }
}

export const authAPI = AuthAPI
