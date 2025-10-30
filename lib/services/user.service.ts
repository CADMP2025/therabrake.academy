/**
 * User Service
 * Business logic for user operations
 */

import { BaseService, ServiceResponse } from './base.service'
import { createClient } from '@/lib/supabase/server'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  full_name?: string
  avatar_url?: string
  phone?: string
  bio?: string
}

export class UserService extends BaseService {
  constructor() {
    super('UserService')
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<ServiceResponse<UserProfile>> {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return this.failure(error.message)
      }

      this.log('Profile retrieved', { userId })
      return this.success(data)
    } catch (error) {
      return this.handleError(error, 'Failed to get profile')
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: UpdateProfileData
  ): Promise<ServiceResponse<UserProfile>> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return this.failure(error.message)
      }

      this.log('Profile updated', { userId })
      return this.success(data, 'Profile updated successfully')
    } catch (error) {
      return this.handleError(error, 'Failed to update profile')
    }
  }

  /**
   * Check if user has role
   */
  async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const supabase = await createClient()

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      return data?.role === role
    } catch (error) {
      this.logError('Failed to check user role', error as Error)
      return false
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<ServiceResponse<UserProfile>> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        return this.failure(error.message)
      }

      return this.success(data)
    } catch (error) {
      return this.handleError(error, 'Failed to get user by email')
    }
  }
}

export const userService = new UserService()
