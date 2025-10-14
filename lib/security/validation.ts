/**
 * Secure Validation Utilities
 * 
 * Wraps validator.js with additional security checks to mitigate
 * known vulnerabilities, particularly the URL validation bypass
 * (GHSA-9965-vmph-33xx)
 */

import validator from 'validator';
import { z } from 'zod';

/**
 * Secure URL validation with additional checks beyond validator.js
 * Mitigates CVE for URL validation bypass
 */
export function isSecureURL(url: string, options?: validator.IsURLOptions): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // First pass: validator.js basic check
  if (!validator.isURL(url, options)) return false;
  
  // Additional security checks to prevent bypass
  try {
    const parsed = new URL(url);
    
    // Block javascript: and data: URIs
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return false;
    }
    
    // Ensure protocol is http or https only (unless explicitly allowed)
    const allowedProtocols = options?.protocols || ['http', 'https'];
    if (!allowedProtocols.includes(parsed.protocol.replace(':', ''))) {
      return false;
    }
    
    // Block URLs with credentials in them
    if (parsed.username || parsed.password) {
      return false;
    }
    
    // Block localhost/internal IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsed.hostname.toLowerCase();
      const blockedHosts = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '::1',
        '169.254.169.254', // AWS metadata
      ];
      
      if (blockedHosts.includes(hostname)) {
        return false;
      }
      
      // Block private IP ranges
      if (hostname.startsWith('192.168.') || 
          hostname.startsWith('10.') ||
          hostname.startsWith('172.16.') ||
          hostname.startsWith('172.31.')) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Email validation with additional security checks
 */
export function isSecureEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // Use validator.js
  if (!validator.isEmail(email, { 
    allow_utf8_local_part: false,
    require_tld: true,
    allow_ip_domain: false
  })) {
    return false;
  }
  
  // Additional checks
  const [local, domain] = email.split('@');
  
  // Reject if local part is too long (RFC 5321)
  if (local.length > 64) return false;
  
  // Reject if domain is too long
  if (domain.length > 255) return false;
  
  // Block common disposable email domains in production
  if (process.env.NODE_ENV === 'production') {
    const disposableDomains = [
      'tempmail.com',
      'throwaway.email',
      '10minutemail.com',
      'guerrillamail.com',
    ];
    
    if (disposableDomains.some(d => domain.toLowerCase().endsWith(d))) {
      return false;
    }
  }
  
  return true;
}

/**
 * Password strength validation
 */
export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
} {
  const errors: string[] = [];
  let score = 0;

  const minLength = parseInt(process.env.MIN_PASSWORD_LENGTH || '12');
  
  if (!password || password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  } else {
    score += 1;
  }
  
  if (password.length >= 16) score += 1;
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  } else {
    score += 1;
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  } else {
    score += 1;
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain special characters');
  } else {
    score += 1;
  }
  
  // Check for common patterns
  const commonPatterns = [
    /^(.)\1+$/, // All same character
    /^123456/, // Sequential numbers
    /^abcdef/i, // Sequential letters
    /password/i,
    /admin/i,
    /letmein/i,
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common patterns');
    score = Math.max(0, score - 2);
  }

  let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score <= 2) strength = 'weak';
  else if (score <= 4) strength = 'medium';
  else if (score <= 5) strength = 'strong';
  else strength = 'very-strong';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * License number validation (Texas LPC format)
 */
export function isValidTexasLicense(license: string): boolean {
  if (!license || typeof license !== 'string') return false;
  
  // Clean the input
  const cleaned = license.trim().toUpperCase();
  
  // Texas LPC format: typically starts with LPC followed by numbers
  // Example: LPC12345 or LPC-INTERN-12345
  const texasLpcPattern = /^LPC(-INTERN)?-?\d{4,6}$/;
  
  return texasLpcPattern.test(cleaned);
}

/**
 * Sanitize input to prevent XSS
 * Note: This is in addition to DOMPurify for double protection
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 10000); // Limit length to prevent DoS
}

/**
 * Safe filename validation
 */
export function isValidFilename(filename: string): boolean {
  if (!filename || typeof filename !== 'string') return false;
  
  // Block directory traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }
  
  // Block null bytes
  if (filename.includes('\0')) {
    return false;
  }
  
  // Must have valid extension
  const validExtensions = (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,mp4,mp3,jpg,jpeg,png').split(',');
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (!extension || !validExtensions.includes(extension)) {
    return false;
  }
  
  // Reasonable length
  if (filename.length > 255) {
    return false;
  }
  
  return true;
}

/**
 * Zod schemas for common validation needs
 * More robust than validator.js for complex validation
 */
export const secureSchemas = {
  email: z.string().email().min(3).max(320).refine(isSecureEmail, {
    message: 'Invalid or insecure email address',
  }),
  
  url: z.string().url().refine(isSecureURL, {
    message: 'Invalid or insecure URL',
  }),
  
  password: z.string().refine(
    (val) => isStrongPassword(val).isValid,
    (val) => ({ message: isStrongPassword(val).errors.join(', ') })
  ),
  
  texasLicense: z.string().refine(isValidTexasLicense, {
    message: 'Invalid Texas LPC license format',
  }),
  
  phoneNumber: z.string().refine(
    (val) => validator.isMobilePhone(val, 'en-US'),
    { message: 'Invalid US phone number' }
  ),
  
  filename: z.string().refine(isValidFilename, {
    message: 'Invalid filename',
  }),
};

/**
 * Rate limiting helper - validates request signature
 */
export function generateRequestSignature(
  userId: string,
  endpoint: string,
  timestamp: number
): string {
  const crypto = require('crypto');
  const secret = process.env.SESSION_SECRET!;
  
  return crypto
    .createHmac('sha256', secret)
    .update(`${userId}:${endpoint}:${timestamp}`)
    .digest('hex');
}

/**
 * Validate CSRF token
 */
export function isValidCSRFToken(token: string, session: string): boolean {
  if (!token || !session) return false;
  
  const crypto = require('crypto');
  const expected = crypto
    .createHmac('sha256', process.env.SESSION_SECRET!)
    .update(session)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expected)
  );
}

export default {
  isSecureURL,
  isSecureEmail,
  isStrongPassword,
  isValidTexasLicense,
  sanitizeInput,
  isValidFilename,
  generateRequestSignature,
  isValidCSRFToken,
  secureSchemas,
};
