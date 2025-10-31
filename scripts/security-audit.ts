/**
 * Run Security Audit
 * Command-line tool to audit route security
 */

import { auditRouteSecurity, printAuditReport } from '../lib/security/route-audit'

async function main() {
  console.log('Starting route security audit...\n')
  
  try {
    const report = await auditRouteSecurity('./app')
    printAuditReport(report)
    
    // Exit with error code if there are critical issues
    if (report.unprotectedRoutes.length > 0) {
      console.error('\n⚠️  AUDIT FAILED: Unprotected routes detected')
      process.exit(1)
    }
    
    console.log('\n✅ AUDIT PASSED: No critical security issues detected')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ AUDIT ERROR:', error)
    process.exit(1)
  }
}

main()
