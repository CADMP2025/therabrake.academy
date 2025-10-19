/**
 * Security Validation Functions
 * Replaces validator.js with custom secure implementations
 */

import { z } from 'zod';

// Email validation (RFC 5322 compliant)
export function isSecureEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  
  const [local, domain] = email.split('@');
  if (local.length > 64) return false;
  if (domain.length > 253) return false;
  
  return true;
}

// URL validation (HTTP/HTTPS only)
export function isSecureURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Strong password validation
interface PasswordStrength {
  isValid: boolean;
  score: number;
  errors: string[];
}

export function isStrongPassword(password: string): PasswordStrength {
  const errors: string[] = [];
  let score = 0;

  // Length check (minimum 12 characters)
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  } else {
    score += 2;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Common patterns check
  const commonPatterns = [
    /password/i,
    /123456/,
    /qwerty/i,
    /abc123/i,
    /letmein/i,
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns');
      score -= 2;
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    score: Math.max(0, score),
    errors,
  };
}

// Texas LPC license validation
export function isValidTexasLicense(license: string): boolean {
  // Texas LPC format: LPC + 6 digits (e.g., LPC123456)
  const licenseRegex = /^LPC\d{6}$/i;
  return licenseRegex.test(license.trim());
}

// Input sanitization (prevent XSS)
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Filename validation (prevent path traversal)
export function isValidFilename(filename: string): boolean {
  // No path separators or special characters
  const invalidChars = /[\/\\<>:"|?*\x00-\x1f]/;
  if (invalidChars.test(filename)) return false;
  
  // No relative path components
  if (filename.includes('..')) return false;
  
  // Not too long
  if (filename.length > 255) return false;
  
  return true;
}

// Rate limiting signature generation
export function generateRequestSignature(
  ip: string,
  endpoint: string,
  timestamp: number
): string {
  const data = `${ip}:${endpoint}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

// CSRF token validation
export function isValidCSRFToken(token: string, expected: string): boolean {
  if (token.length !== expected.length) return false;
  
  // Constant-time comparison to prevent timing attacks
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  
  return result === 0;
}

// Zod schemas for validation
export const securitySchemas = {
  email: z.string().refine(isSecureEmail, {
    message: 'Please enter a valid email address',
  }),
  
  url: z.string().refine(isSecureURL, {
    message: 'Please enter a valid HTTP or HTTPS URL',
  }),
  
  // Use superRefine for dynamic password error messages
  password: z.string().superRefine((val, ctx) => {
    const result = isStrongPassword(val);
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.errors.join(', '),
      });
    }
  }),
  
  texasLicense: z.string().refine(isValidTexasLicense, {
    message: 'Please enter a valid Texas LPC license number (format: LPC123456)',
  }),
  
  filename: z.string().refine(isValidFilename, {
    message: 'Invalid filename. Must not contain special characters or path components',
  }),
  
  sanitizedInput: z.string().transform(sanitizeInput),
};

// Export validation utilities
const validationUtils = {
  isSecureEmail,
  isSecureURL,
  isStrongPassword,
  isValidTexasLicense,
  sanitizeInput,
  isValidFilename,
  generateRequestSignature,
  isValidCSRFToken,
  schemas: securitySchemas,
};

export default validationUtils;
