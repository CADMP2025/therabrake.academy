import { getSupabase } from './supabase'
import type { Certificate, ApiResponse } from '@therabrake/shared-types'

export class CertificatesAPI {
  /**
   * Get user's certificates
   */
  static async getUserCertificates(userId: string): Promise<ApiResponse<Certificate[]>> {
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(title)')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: data as Certificate[],
    }
  }

  /**
   * Get certificate by ID
   */
  static async getCertificate(certificateId: string): Promise<ApiResponse<Certificate>> {
    const supabase = getSupabase()
    
    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(title), profiles(full_name)')
      .eq('id', certificateId)
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: data as Certificate,
    }
  }

  /**
   * Generate certificate (requires server-side API call)
   */
  static async generateCertificate(enrollmentId: string, apiUrl: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${apiUrl}/api/certificates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enrollmentId }),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Failed to generate certificate',
        }
      }

      return {
        success: true,
        data: result,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      }
    }
  }

  /**
   * Download certificate
   */
  static async downloadCertificate(certificateId: string, apiUrl: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${apiUrl}/api/certificates/download?id=${certificateId}`)

      if (!response.ok) {
        return {
          success: false,
          error: 'Failed to download certificate',
        }
      }

      const blob = await response.blob()

      return {
        success: true,
        data: blob,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      }
    }
  }
}

export const certificatesAPI = CertificatesAPI
