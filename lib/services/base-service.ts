/**
 * Base Service Class
 * Provides common patterns for all services
 */

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export abstract class BaseService {
  protected success<T>(data: T): ServiceResponse<T> {
    return {
      success: true,
      data
    }
  }

  protected error(error: string, code?: string): ServiceResponse<never> {
    return {
      success: false,
      error,
      code
    }
  }
}
