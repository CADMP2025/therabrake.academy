/**
 * Route Security Audit Tool
 * Scans all routes and verifies proper protection
 */

import { readdirSync, statSync } from 'fs'
import { join } from 'path'

export interface RouteSecurityCheck {
  path: string
  hasAuth: boolean
  hasRoleCheck: boolean
  hasRateLimit: boolean
  requiresMFA: boolean
  isPublic: boolean
  risks: string[]
}

export interface SecurityAuditReport {
  totalRoutes: number
  protectedRoutes: number
  publicRoutes: number
  unprotectedRoutes: RouteSecurityCheck[]
  mfaRequiredRoutes: RouteSecurityCheck[]
  recommendations: string[]
  timestamp: Date
}

/**
 * Expected protection patterns for different route types
 */
const PROTECTION_REQUIREMENTS = {
  admin: {
    requiresAuth: true,
    requiresRole: ['admin'],
    requiresMFA: true,
    requiresRateLimit: true,
  },
  instructor: {
    requiresAuth: true,
    requiresRole: ['instructor', 'admin'],
    requiresMFA: true,
    requiresRateLimit: true,
  },
  student: {
    requiresAuth: true,
    requiresRole: ['student', 'instructor', 'admin'],
    requiresMFA: false,
    requiresRateLimit: true,
  },
  api: {
    requiresAuth: true,
    requiresRole: null, // Varies by endpoint
    requiresMFA: false,
    requiresRateLimit: true,
  },
  public: {
    requiresAuth: false,
    requiresRole: null,
    requiresMFA: false,
    requiresRateLimit: false,
  },
}

/**
 * Routes that should be public (no authentication required)
 */
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/auth/password-reset',
  '/api/health',
  '/api/public/verify',
  '/api/webhooks/stripe',
  '/api/webhooks/certificate-generated',
  '/api/webhooks/enrollment-created',
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/courses',
  '/terms',
  '/privacy',
  '/refund-policy',
]

/**
 * Routes that require MFA
 */
const MFA_REQUIRED_ROUTES = [
  '/admin',
  '/api/admin',
  '/instructor/earnings',
  '/api/stripe',
  '/api/certificates/revoke',
]

/**
 * Scan a route file for security patterns
 */
function analyzeRouteFile(filePath: string, relativePath: string): RouteSecurityCheck {
  const content = require('fs').readFileSync(filePath, 'utf-8')
  const risks: string[] = []
  
  // Check for authentication
  const hasAuth = 
    content.includes('getUser()') ||
    content.includes('requireAuth') ||
    content.includes('cookies().get') ||
    content.includes('getCurrentUser')
  
  // Check for role validation
  const hasRoleCheck = 
    content.includes('role === ') ||
    content.includes("role: 'admin'") ||
    content.includes("role: 'instructor'") ||
    content.includes('hasRole')
  
  // Check for rate limiting
  const hasRateLimit = 
    content.includes('rateLimit') ||
    content.includes('Ratelimit')
  
  // Determine if route should be public
  const isPublic = PUBLIC_ROUTES.some(route => relativePath.startsWith(route))
  
  // Determine if MFA should be required
  const requiresMFA = MFA_REQUIRED_ROUTES.some(route => relativePath.startsWith(route))
  
  // Identify risks
  if (!isPublic && !hasAuth) {
    risks.push('Missing authentication check')
  }
  
  if (relativePath.includes('/admin') && !hasRoleCheck) {
    risks.push('Admin route missing role validation')
  }
  
  if (relativePath.includes('/instructor') && !hasRoleCheck) {
    risks.push('Instructor route missing role validation')
  }
  
  if (!hasRateLimit && !isPublic) {
    risks.push('Missing rate limiting')
  }
  
  if (requiresMFA && !content.includes('mfa')) {
    risks.push('Should require MFA but no MFA check found')
  }
  
  // Check for common vulnerabilities
  if (content.includes('eval(')) {
    risks.push('CRITICAL: Uses eval() - potential code injection')
  }
  
  if (content.includes('dangerouslySetInnerHTML')) {
    risks.push('WARNING: Uses dangerouslySetInnerHTML - XSS risk')
  }
  
  if (content.match(/\$\{.*req\./)) {
    risks.push('WARNING: String interpolation with request data - injection risk')
  }
  
  return {
    path: relativePath,
    hasAuth,
    hasRoleCheck,
    hasRateLimit,
    requiresMFA,
    isPublic,
    risks,
  }
}

/**
 * Recursively scan directory for route files
 */
function scanDirectory(dir: string, baseDir: string, results: RouteSecurityCheck[] = []): RouteSecurityCheck[] {
  const files = readdirSync(dir)
  
  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, baseDir, results)
    } else if (
      (file === 'route.ts' || file === 'route.tsx' || file === 'page.tsx' || file === 'page.ts') &&
      !fullPath.includes('node_modules')
    ) {
      const relativePath = fullPath.replace(baseDir, '').replace(/\\/g, '/')
      const check = analyzeRouteFile(fullPath, relativePath)
      results.push(check)
    }
  }
  
  return results
}

/**
 * Run comprehensive security audit on all routes
 */
export async function auditRouteSecurity(appDir: string = './app'): Promise<SecurityAuditReport> {
  const checks = scanDirectory(appDir, appDir)
  
  const protectedRoutes = checks.filter(c => !c.isPublic && c.hasAuth)
  const publicRoutes = checks.filter(c => c.isPublic)
  const unprotectedRoutes = checks.filter(c => !c.isPublic && !c.hasAuth)
  const mfaRequiredRoutes = checks.filter(c => c.requiresMFA)
  
  const recommendations: string[] = []
  
  // Generate recommendations
  if (unprotectedRoutes.length > 0) {
    recommendations.push(
      `⚠️  ${unprotectedRoutes.length} routes lack authentication - immediate action required`
    )
  }
  
  const missingRoleChecks = checks.filter(
    c => (c.path.includes('/admin') || c.path.includes('/instructor')) && !c.hasRoleCheck
  )
  if (missingRoleChecks.length > 0) {
    recommendations.push(
      `⚠️  ${missingRoleChecks.length} privileged routes lack role validation`
    )
  }
  
  const missingRateLimit = checks.filter(c => !c.isPublic && !c.hasRateLimit)
  if (missingRateLimit.length > 0) {
    recommendations.push(
      `ℹ️  ${missingRateLimit.length} routes lack rate limiting - consider adding`
    )
  }
  
  const missingMFA = mfaRequiredRoutes.filter(r => r.risks.some(risk => risk.includes('MFA')))
  if (missingMFA.length > 0) {
    recommendations.push(
      `⚠️  ${missingMFA.length} high-privilege routes should enforce MFA`
    )
  }
  
  // Check for critical vulnerabilities
  const criticalRisks = checks.filter(c => c.risks.some(r => r.includes('CRITICAL')))
  if (criticalRisks.length > 0) {
    recommendations.push(
      `🚨 ${criticalRisks.length} routes have CRITICAL security vulnerabilities - fix immediately`
    )
  }
  
  return {
    totalRoutes: checks.length,
    protectedRoutes: protectedRoutes.length,
    publicRoutes: publicRoutes.length,
    unprotectedRoutes,
    mfaRequiredRoutes,
    recommendations,
    timestamp: new Date(),
  }
}

/**
 * Print audit report to console
 */
export function printAuditReport(report: SecurityAuditReport): void {
  console.log('\n' + '='.repeat(80))
  console.log('ROUTE SECURITY AUDIT REPORT')
  console.log('='.repeat(80))
  console.log(`Generated: ${report.timestamp.toISOString()}`)
  console.log(`\nTotal Routes: ${report.totalRoutes}`)
  console.log(`Protected: ${report.protectedRoutes} (${((report.protectedRoutes / report.totalRoutes) * 100).toFixed(1)}%)`)
  console.log(`Public: ${report.publicRoutes} (${((report.publicRoutes / report.totalRoutes) * 100).toFixed(1)}%)`)
  console.log(`Unprotected: ${report.unprotectedRoutes.length}`)
  
  if (report.recommendations.length > 0) {
    console.log('\n' + '-'.repeat(80))
    console.log('RECOMMENDATIONS')
    console.log('-'.repeat(80))
    report.recommendations.forEach(rec => console.log(rec))
  }
  
  if (report.unprotectedRoutes.length > 0) {
    console.log('\n' + '-'.repeat(80))
    console.log('UNPROTECTED ROUTES (NEEDS REVIEW)')
    console.log('-'.repeat(80))
    report.unprotectedRoutes.forEach(route => {
      console.log(`\n${route.path}`)
      route.risks.forEach(risk => console.log(`  - ${risk}`))
    })
  }
  
  console.log('\n' + '='.repeat(80) + '\n')
}
