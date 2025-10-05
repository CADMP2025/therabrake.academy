/**
 * Input Sanitization & Validation
 * Prevents XSS, SQL Injection, and other injection attacks
 */

import DOMPurify from 'isomorphic-dompurify';

export class InputValidator {
  /**
   * Sanitize HTML content from course builder (TipTap editor)
   * Allows safe formatting while removing malicious code
   */
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'a', 
        'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 
        'blockquote', 'code', 'pre', 'img', 'table', 
        'thead', 'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  }

  /**
   * Sanitize plain text input (names, emails, etc.)
   */
  static sanitizeText(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate and sanitize file upload
   */
  static async validateFileUpload(file: File): Promise<{
    valid: boolean;
    error?: string;
    sanitizedName?: string;
  }> {
    // Check file size (50MB max)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { valid: false, error: 'File size exceeds 50MB limit' };
    }

    // Validate MIME type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Allowed: PDF, Word, Images' };
    }

    // Sanitize filename
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars
      .replace(/\.+/g, '.') // Remove multiple dots
      .substring(0, 255); // Limit length

    return { valid: true, sanitizedName };
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Texas LPC license number
   */
  static validateLicenseNumber(license: string, state: string = 'TX'): boolean {
    if (state === 'TX') {
      // Texas LPC format: typically 5-6 digits
      return /^\d{5,6}$/.test(license);
    }
    // Add other state validations as needed
    return license.length >= 4 && license.length <= 15;
  }

  /**
   * Sanitize URL input
   */
  static sanitizeURL(url: string): string | null {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return null;
      }
      return parsed.toString();
    } catch {
      return null;
    }
  }

  /**
   * Rate limiting validation
   */
  static checkRateLimit(
    identifier: string,
    limit: number = 5,
    windowMs: number = 15 * 60 * 1000
  ): { allowed: boolean; remaining: number } {
    // This would integrate with Redis or similar in production
    // For now, return basic validation
    return { allowed: true, remaining: limit };
  }
}

/**
 * Middleware helper for sanitizing request body
 */
export function sanitizeRequestBody<T extends Record<string, any>>(
  body: T
): T {
  const sanitized = { ...body };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      // Sanitize text fields
      if (key.includes('html') || key.includes('content') || key.includes('description')) {
        sanitized[key] = InputValidator.sanitizeHTML(value);
      } else {
        sanitized[key] = InputValidator.sanitizeText(value);
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? InputValidator.sanitizeText(item) : item
      );
    }
  }

  return sanitized;
}
