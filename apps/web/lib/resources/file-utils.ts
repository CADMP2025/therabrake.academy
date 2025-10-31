/**
 * File Utilities
 * Helper functions for file operations, validation, and processing
 */

export interface FileValidationResult {
  isValid: boolean
  error?: string
  fileSize?: number
  fileType?: string
}

export interface FileMetadata {
  name: string
  size: number
  type: string
  extension: string
  lastModified: Date
}

/**
 * Allowed file types for different purposes
 */
export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  videos: ['video/mp4', 'video/webm', 'video/ogg'],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
  certificates: ['application/pdf']
} as const

/**
 * Maximum file sizes in bytes
 */
export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024,      // 5MB
  document: 10 * 1024 * 1024,  // 10MB
  video: 100 * 1024 * 1024,    // 100MB
  audio: 10 * 1024 * 1024,     // 10MB
  certificate: 5 * 1024 * 1024 // 5MB
} as const

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): FileValidationResult {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${formatFileSize(maxSize)}`
    }
  }

  return {
    isValid: true,
    fileSize: file.size,
    fileType: file.type
  }
}

/**
 * Extract file metadata
 */
export function getFileMetadata(file: File): FileMetadata {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension,
    lastModified: new Date(file.lastModified)
  }
}

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Convert file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * Convert base64 to Blob
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteString = atob(base64.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  
  return new Blob([ab], { type: mimeType })
}

/**
 * Download file from blob
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  const sanitizedName = nameWithoutExt.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  
  return `${sanitizedName}_${timestamp}.${extension}`
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

/**
 * Get file extension from filename or MIME type
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check if file is an image
 */
export function isImage(file: File): boolean {
  return ALLOWED_FILE_TYPES.images.includes(file.type as any)
}

/**
 * Check if file is a PDF
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf'
}

/**
 * Compress image file (client-side)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          file.type,
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
  })
}
