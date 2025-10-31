/**
 * Image Upload Service
 * Handles image uploads to Supabase Storage with validation and optimization
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { logger } from '@/lib/monitoring/logger'

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface ImageUploadOptions {
  bucket?: string
  folder?: string
  maxSizeMB?: number
  allowedTypes?: string[]
  generateThumbnail?: boolean
}

export class ImageUploadService {
  private static instance: ImageUploadService
  private supabase = createClientComponentClient()

  private defaultOptions: Required<ImageUploadOptions> = {
    bucket: 'course-images',
    folder: 'content',
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    generateThumbnail: false
  }

  private constructor() {}

  static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService()
    }
    return ImageUploadService.instance
  }

  /**
   * Upload image file to Supabase Storage
   */
  async uploadImage(
    file: File,
    options: Partial<ImageUploadOptions> = {}
  ): Promise<ImageUploadResult> {
    const opts = { ...this.defaultOptions, ...options }

    try {
      // Validate file type
      if (!opts.allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: `Unsupported file type: ${file.type}`
        }
      }

      // Validate file size
      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > opts.maxSizeMB) {
        return {
          success: false,
          error: `File too large: ${sizeMB.toFixed(2)}MB (max: ${opts.maxSizeMB}MB)`
        }
      }

      // Generate unique filename
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${random}.${extension}`
      const path = `${opts.folder}/${filename}`

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(opts.bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        logger.error('Image upload failed', new Error(error.message))
        return {
          success: false,
          error: error.message
        }
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(opts.bucket)
        .getPublicUrl(data.path)

      logger.info('Image uploaded successfully', { path: data.path })

      return {
        success: true,
        url: publicUrl
      }
    } catch (error) {
      logger.error('Image upload error', error as Error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Upload image from data URL (base64)
   */
  async uploadFromDataURL(
    dataUrl: string,
    filename: string,
    options: Partial<ImageUploadOptions> = {}
  ): Promise<ImageUploadResult> {
    try {
      // Convert data URL to Blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      // Create File from Blob
      const file = new File([blob], filename, { type: blob.type })
      
      // Upload using standard method
      return await this.uploadImage(file, options)
    } catch (error) {
      logger.error('Data URL upload error', error as Error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process data URL'
      }
    }
  }

  /**
   * Delete image from storage
   */
  async deleteImage(
    url: string,
    options: Partial<Pick<ImageUploadOptions, 'bucket'>> = {}
  ): Promise<boolean> {
    try {
      const bucket = options.bucket || this.defaultOptions.bucket
      
      // Extract path from URL
      const urlObj = new URL(url)
      const path = urlObj.pathname.split(`/${bucket}/`)[1]
      
      if (!path) {
        logger.error('Invalid image URL', new Error(url))
        return false
      }

      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        logger.error('Image deletion failed', new Error(error.message))
        return false
      }

      logger.info('Image deleted successfully', { path })
      return true
    } catch (error) {
      logger.error('Image deletion error', error as Error)
      return false
    }
  }

  /**
   * Validate image dimensions
   */
  async validateDimensions(
    file: File,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<{ valid: boolean; width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        
        const valid = (
          (!maxWidth || img.width <= maxWidth) &&
          (!maxHeight || img.height <= maxHeight)
        )

        resolve({
          valid,
          width: img.width,
          height: img.height
        })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve({ valid: false, width: 0, height: 0 })
      }

      img.src = url
    })
  }
}

// Export singleton instance
export const imageUploadService = ImageUploadService.getInstance()
