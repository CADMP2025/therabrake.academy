/**
 * Validation Utilities
 * Helper functions for data validation
 */

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Check if value is valid email
 */
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

/**
 * Check if value is valid URL
 */
export function isUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/**
 * Check if value is valid phone number (US format)
 */
export function isPhoneNumber(value: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return phoneRegex.test(value)
}

/**
 * Check if value is valid credit card number (Luhn algorithm)
 */
export function isCreditCard(value: string): boolean {
  const cleaned = value.replace(/\D/g, '')
  
  if (cleaned.length < 13 || cleaned.length > 19) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * Check if value is valid ZIP code (US format)
 */
export function isZipCode(value: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(value)
}

/**
 * Check if value is strong password
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export function isStrongPassword(value: string): boolean {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongRegex.test(value)
}

/**
 * Check if value is valid date
 */
export function isValidDate(value: any): boolean {
  const date = new Date(value)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Check if value is in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Check if string matches pattern
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value)
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missing: string[] } {
  const missing = requiredFields.filter(field => isEmpty(data[field]))
  
  return {
    isValid: missing.length === 0,
    missing
  }
}

/**
 * Check if value is alphanumeric
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value)
}

/**
 * Check if value contains only letters
 */
export function isAlpha(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value)
}

/**
 * Check if value is numeric
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value)
}

/**
 * Check if value is valid JSON
 */
export function isJson(value: string): boolean {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}
