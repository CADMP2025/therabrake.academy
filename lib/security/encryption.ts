/**
 * Field-Level Encryption for PII
 * Encrypts sensitive data like SSN, payment info, addresses
 */

import crypto from 'crypto'

// Encryption configuration
const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits
const AUTH_TAG_LENGTH = 16 // 128 bits
const SALT_LENGTH = 64

/**
 * Get encryption key from environment or generate
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required')
  }
  
  // Derive key using PBKDF2
  const salt = process.env.ENCRYPTION_SALT || 'therabrake-academy-salt'
  return crypto.pbkdf2Sync(key, salt, 100000, KEY_LENGTH, 'sha512')
}

/**
 * Encrypt sensitive data
 */
export function encryptField(plaintext: string): string {
  if (!plaintext) return plaintext
  
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    let encrypted = cipher.update(plaintext, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    
    const authTag = cipher.getAuthTag()
    
    // Combine IV + AuthTag + Encrypted data
    const combined = Buffer.concat([
      iv,
      authTag,
      Buffer.from(encrypted, 'base64'),
    ])
    
    return combined.toString('base64')
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt sensitive data
 */
export function decryptField(encrypted: string): string {
  if (!encrypted) return encrypted
  
  try {
    const key = getEncryptionKey()
    const combined = Buffer.from(encrypted, 'base64')
    
    // Extract IV, auth tag, and encrypted data
    const iv = combined.subarray(0, IV_LENGTH)
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
    const encryptedData = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH)
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encryptedData)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    
    return decrypted.toString('utf8')
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Mask sensitive data for display (e.g., SSN: ***-**-1234)
 */
export function maskSSN(ssn: string): string {
  if (!ssn || ssn.length < 4) return '***-**-****'
  return `***-**-${ssn.slice(-4)}`
}

/**
 * Mask credit card number
 */
export function maskCreditCard(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) return '****-****-****-****'
  return `****-****-****-${cardNumber.slice(-4)}`
}

/**
 * Mask email address
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***'
  const [local, domain] = email.split('@')
  const maskedLocal = local.length > 2 ? local[0] + '***' + local[local.length - 1] : '***'
  return `${maskedLocal}@${domain}`
}

/**
 * Mask phone number
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '***-***-****'
  const digits = phone.replace(/\D/g, '')
  return `***-***-${digits.slice(-4)}`
}

/**
 * Mask address (show only city and state)
 */
export function maskAddress(address: {
  street?: string
  city?: string
  state?: string
  zip?: string
}): string {
  if (!address.city || !address.state) return '***'
  return `***, ${address.city}, ${address.state} ****`
}

/**
 * Encrypt object with selective field encryption
 */
export function encryptObject<T extends Record<string, any>>(
  obj: T,
  sensitiveFields: (keyof T)[]
): T {
  const encrypted = { ...obj }
  
  for (const field of sensitiveFields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encryptField(encrypted[field] as string) as any
    }
  }
  
  return encrypted
}

/**
 * Decrypt object with selective field decryption
 */
export function decryptObject<T extends Record<string, any>>(
  obj: T,
  sensitiveFields: (keyof T)[]
): T {
  const decrypted = { ...obj }
  
  for (const field of sensitiveFields) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      decrypted[field] = decryptField(decrypted[field] as string) as any
    }
  }
  
  return decrypted
}

/**
 * Generate encryption key (for initial setup)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('base64')
}

/**
 * Generate encryption salt (for initial setup)
 */
export function generateEncryptionSalt(): string {
  return crypto.randomBytes(SALT_LENGTH).toString('base64')
}

/**
 * Rotate encryption key (re-encrypt all data with new key)
 */
export async function rotateEncryptionKey(
  oldKey: string,
  newKey: string,
  dataToRotate: Array<{ id: string; encryptedField: string }>
): Promise<Array<{ id: string; encryptedField: string }>> {
  const rotated: Array<{ id: string; encryptedField: string }> = []
  
  // Temporarily set old key
  const originalKey = process.env.ENCRYPTION_KEY
  process.env.ENCRYPTION_KEY = oldKey
  
  for (const item of dataToRotate) {
    try {
      // Decrypt with old key
      const decrypted = decryptField(item.encryptedField)
      
      // Encrypt with new key
      process.env.ENCRYPTION_KEY = newKey
      const encrypted = encryptField(decrypted)
      
      rotated.push({
        id: item.id,
        encryptedField: encrypted,
      })
      
      // Reset to old key for next iteration
      process.env.ENCRYPTION_KEY = oldKey
    } catch (error) {
      console.error(`Failed to rotate key for item ${item.id}:`, error)
      throw error
    }
  }
  
  // Restore original key
  process.env.ENCRYPTION_KEY = originalKey
  
  return rotated
}

/**
 * Hash sensitive data for indexing (one-way, for lookups)
 */
export function hashForIndex(data: string): string {
  const salt = process.env.HASH_SALT || 'therabrake-academy-hash-salt'
  return crypto
    .pbkdf2Sync(data, salt, 100000, 32, 'sha512')
    .toString('base64')
}

/**
 * Anonymize data for analytics (deterministic)
 */
export function anonymizeForAnalytics(userId: string): string {
  // Create deterministic anonymous ID
  const salt = process.env.ANALYTICS_SALT || 'therabrake-academy-analytics-salt'
  return crypto
    .createHash('sha256')
    .update(userId + salt)
    .digest('hex')
    .substring(0, 16)
}

/**
 * Check if data is encrypted
 */
export function isEncrypted(data: string): boolean {
  try {
    const buffer = Buffer.from(data, 'base64')
    // Check if it has the expected structure (IV + AuthTag + Data)
    return buffer.length > IV_LENGTH + AUTH_TAG_LENGTH
  } catch {
    return false
  }
}

/**
 * Sensitive field definitions for different data types
 */
export const SENSITIVE_FIELDS = {
  user: ['ssn', 'tax_id', 'date_of_birth'],
  payment: ['card_number', 'cvv', 'bank_account'],
  address: ['street_address', 'apartment'],
  contact: ['phone', 'emergency_contact_phone'],
  medical: ['diagnosis', 'treatment_notes', 'prescription'],
  educational: ['grade', 'test_scores', 'disciplinary_records'],
} as const
