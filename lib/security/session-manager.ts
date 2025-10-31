/**
 * Session Security Manager
 * Handles session timeouts, geographic restrictions, and MFA enforcement
 */

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const SESSION_CONFIG = {
  // Session timeout: 30 minutes of inactivity
  SESSION_TIMEOUT_MS: 30 * 60 * 1000,
  
  // Absolute session limit: 12 hours
  MAX_SESSION_DURATION_MS: 12 * 60 * 60 * 1000,
  
  // Cookie names
  LAST_ACTIVITY_COOKIE: 'last_activity',
  SESSION_START_COOKIE: 'session_start',
  MFA_VERIFIED_COOKIE: 'mfa_verified',
  
  // Geographic restrictions
  RESTRICTED_COUNTRIES: ['KP', 'IR', 'SY', 'CU'], // OFAC sanctioned countries
  
  // MFA requirements
  MFA_REQUIRED_ROLES: ['admin', 'instructor'],
}

export interface SessionStatus {
  isValid: boolean
  isExpired: boolean
  isMaxDurationExceeded: boolean
  requiresMFA: boolean
  mfaVerified: boolean
  lastActivity?: Date
  sessionStart?: Date
  remainingTime?: number
  reason?: string
}

/**
 * Check if session is valid and within timeout limits
 */
export async function checkSessionStatus(): Promise<SessionStatus> {
  const cookieStore = cookies()
  const supabase = await createClient()
  
  // Get user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      isValid: false,
      isExpired: true,
      isMaxDurationExceeded: false,
      requiresMFA: false,
      mfaVerified: false,
      reason: 'No active session',
    }
  }
  
  // Check last activity
  const lastActivityCookie = cookieStore.get(SESSION_CONFIG.LAST_ACTIVITY_COOKIE)
  const lastActivity = lastActivityCookie ? new Date(lastActivityCookie.value) : null
  
  if (lastActivity) {
    const timeSinceActivity = Date.now() - lastActivity.getTime()
    
    if (timeSinceActivity > SESSION_CONFIG.SESSION_TIMEOUT_MS) {
      return {
        isValid: false,
        isExpired: true,
        isMaxDurationExceeded: false,
        requiresMFA: false,
        mfaVerified: false,
        lastActivity,
        reason: 'Session timeout due to inactivity',
      }
    }
  }
  
  // Check max session duration
  const sessionStartCookie = cookieStore.get(SESSION_CONFIG.SESSION_START_COOKIE)
  const sessionStart = sessionStartCookie ? new Date(sessionStartCookie.value) : null
  
  if (sessionStart) {
    const sessionDuration = Date.now() - sessionStart.getTime()
    
    if (sessionDuration > SESSION_CONFIG.MAX_SESSION_DURATION_MS) {
      return {
        isValid: false,
        isExpired: false,
        isMaxDurationExceeded: true,
        requiresMFA: false,
        mfaVerified: false,
        sessionStart,
        reason: 'Maximum session duration exceeded',
      }
    }
  }
  
  // Check MFA requirements
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  const requiresMFA = profile?.role && SESSION_CONFIG.MFA_REQUIRED_ROLES.includes(profile.role)
  const mfaVerifiedCookie = cookieStore.get(SESSION_CONFIG.MFA_VERIFIED_COOKIE)
  const mfaVerified = mfaVerifiedCookie?.value === 'true'
  
  if (requiresMFA && !mfaVerified) {
    return {
      isValid: false,
      isExpired: false,
      isMaxDurationExceeded: false,
      requiresMFA: true,
      mfaVerified: false,
      reason: 'MFA verification required',
    }
  }
  
  // Calculate remaining time
  const remainingTime = lastActivity
    ? SESSION_CONFIG.SESSION_TIMEOUT_MS - (Date.now() - lastActivity.getTime())
    : SESSION_CONFIG.SESSION_TIMEOUT_MS
  
  return {
    isValid: true,
    isExpired: false,
    isMaxDurationExceeded: false,
    requiresMFA,
    mfaVerified,
    lastActivity: lastActivity || undefined,
    sessionStart: sessionStart || undefined,
    remainingTime,
  }
}

/**
 * Update last activity timestamp
 */
export async function updateLastActivity(): Promise<void> {
  const cookieStore = cookies()
  
  cookieStore.set(SESSION_CONFIG.LAST_ACTIVITY_COOKIE, new Date().toISOString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_CONFIG.SESSION_TIMEOUT_MS / 1000,
  })
}

/**
 * Initialize session start time
 */
export async function initializeSession(): Promise<void> {
  const cookieStore = cookies()
  
  cookieStore.set(SESSION_CONFIG.SESSION_START_COOKIE, new Date().toISOString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_CONFIG.MAX_SESSION_DURATION_MS / 1000,
  })
  
  await updateLastActivity()
}

/**
 * Mark MFA as verified for current session
 */
export async function setMFAVerified(): Promise<void> {
  const cookieStore = cookies()
  
  cookieStore.set(SESSION_CONFIG.MFA_VERIFIED_COOKIE, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_CONFIG.MAX_SESSION_DURATION_MS / 1000,
  })
}

/**
 * Clear all session cookies
 */
export async function clearSession(): Promise<void> {
  const cookieStore = cookies()
  
  cookieStore.delete(SESSION_CONFIG.LAST_ACTIVITY_COOKIE)
  cookieStore.delete(SESSION_CONFIG.SESSION_START_COOKIE)
  cookieStore.delete(SESSION_CONFIG.MFA_VERIFIED_COOKIE)
}

/**
 * Check if request is from a restricted geographic location
 */
export async function checkGeographicRestrictions(
  request: Request
): Promise<{ allowed: boolean; countryCode?: string; reason?: string }> {
  // Get country from Vercel headers or Cloudflare headers
  const cfCountry = request.headers.get('cf-ipcountry')
  const vercelCountry = request.headers.get('x-vercel-ip-country')
  const countryCode = cfCountry || vercelCountry
  
  if (!countryCode) {
    // If we can't determine location, allow (but log)
    console.warn('Unable to determine geographic location for request')
    return { allowed: true, reason: 'Location unknown' }
  }
  
  if (SESSION_CONFIG.RESTRICTED_COUNTRIES.includes(countryCode)) {
    return {
      allowed: false,
      countryCode,
      reason: `Access restricted from ${countryCode}`,
    }
  }
  
  return { allowed: true, countryCode }
}

/**
 * Log security event
 */
export async function logSecurityEvent(event: {
  userId?: string
  type: 'session_timeout' | 'session_max_duration' | 'mfa_required' | 'geographic_restriction' | 'suspicious_activity'
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
}): Promise<void> {
    const supabase = await createClient()
  
  try {
    await supabase.from('security_events').insert({
      user_id: event.userId,
      event_type: event.type,
      event_details: event.details,
      ip_address: event.ipAddress,
      user_agent: event.userAgent,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

/**
 * Enforce session security for a route
 */
export async function enforceSessionSecurity(
  request: Request,
  requireMFA: boolean = false
): Promise<{ allowed: boolean; reason?: string; redirect?: string }> {
  // Check geographic restrictions
  const geoCheck = await checkGeographicRestrictions(request)
  if (!geoCheck.allowed) {
    await logSecurityEvent({
      type: 'geographic_restriction',
      details: { countryCode: geoCheck.countryCode },
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })
    
    return {
      allowed: false,
      reason: geoCheck.reason,
    }
  }
  
  // Check session status
  const sessionStatus = await checkSessionStatus()
  
  if (!sessionStatus.isValid) {
     const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Clear session
    await clearSession()
    
    // Log event
    await logSecurityEvent({
      userId: user?.id,
      type: sessionStatus.isExpired ? 'session_timeout' : 'session_max_duration',
      details: { reason: sessionStatus.reason },
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })
    
    return {
      allowed: false,
      reason: sessionStatus.reason,
      redirect: '/auth/login?reason=session_expired',
    }
  }
  
  // Check MFA if required
  if ((requireMFA || sessionStatus.requiresMFA) && !sessionStatus.mfaVerified) {
     const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await logSecurityEvent({
      userId: user?.id,
      type: 'mfa_required',
      details: { route: request.url },
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })
    
    return {
      allowed: false,
      reason: 'MFA verification required',
      redirect: '/auth/mfa/challenge',
    }
  }
  
  // Update last activity
  await updateLastActivity()
  
  return { allowed: true }
}
