/**
 * Base Service Class
 * Abstract class for all business logic services
 */

import { logger } from '@/lib/monitoring'

export interface ServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ServiceOptions {
  userId?: string
  requestId?: string
  metadata?: Record<string, any>
}

export abstract class BaseService {
  protected serviceName: string

  constructor(serviceName: string) {
    this.serviceName = serviceName
  }

  /**
   * Log service activity
   */
  protected log(message: string, context?: Record<string, any>): void {
    logger.info(`[${this.serviceName}] ${message}`, context)
  }

  /**
   * Log service errors
   */
  protected logError(message: string, error?: Error, context?: Record<string, any>): void {
    logger.error(`[${this.serviceName}] ${message}`, error, context)
  }

  /**
   * Create success response
   */
  protected success<T>(data: T, message?: string): ServiceResponse<T> {
    return {
      success: true,
      data,
      message
    }
  }

  /**
   * Create error response
   */
  protected failure(error: string, details?: any): ServiceResponse {
    return {
      success: false,
      error,
      data: details
    }
  }

  /**
   * Handle service errors
   */
  protected handleError(error: unknown, context?: string): ServiceResponse {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    this.logError(context || 'Service error', error as Error)
    
    return this.failure(errorMessage)
  }

  /**
   * Validate required fields
   */
  protected validateRequired(
    data: Record<string, any>,
    requiredFields: string[]
  ): ServiceResponse | null {
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      return this.failure(
        `Missing required fields: ${missingFields.join(', ')}`,
        { missingFields }
      )
    }
    
    return null
  }
}
