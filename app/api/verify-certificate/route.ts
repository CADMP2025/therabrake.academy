import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cert = searchParams.get('cert')
  const code = searchParams.get('code')
  if (!cert || !code) return NextResponse.json({ valid: false, reason: 'Missing parameters' }, { status: 400 })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '0.0.0.0'
  const ua = req.headers.get('user-agent') || ''

  const supabase = await createSupabaseServerClient()

  // Fraud detection: rate limit failed attempts by IP and certificate
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  const { count: ipFailCount } = await supabase
    .from('verification_attempts')
    .select('*', { head: true, count: 'exact' })
    .eq('success', false)
    .gte('created_at', fifteenMinAgo)
    .eq('ip_address', ip)

  if ((ipFailCount || 0) >= 5) {
    return NextResponse.json({ valid: false, reason: 'Too many attempts, please try later' }, { status: 429 })
  }

  const { data, error } = await supabase.rpc('verify_certificate_rpc', { cert, code })

  let success = false
  let payload: any = { valid: false }

  if (!error && data && data.length > 0) {
    const row = data[0]
    if (!row.is_revoked) {
      success = true
      payload = {
        valid: true,
        certificateNumber: row.certificate_number,
        issuedAt: row.issued_at,
        expiresAt: row.expires_at,
        expired: row.is_expired,
        ceHours: row.ce_hours,
        courseTitle: row.course_title,
        studentName: row.student_name,
        pdfUrl: row.pdf_url,
        revoked: row.is_revoked,
      }
      // Audit log success
      try {
        await supabase.from('certificate_audit_log').insert({
          certificate_id: row.certificate_id,
          user_id: null,
          course_id: null,
          action: 'verified',
          verification_code: code,
          metadata: { ip, ua },
        } as any)
      } catch {}
    } else {
      payload = { valid: false, reason: 'Revoked' }
    }
  }

  // Log attempt (anon insert allowed by RLS)
  try {
    const hash = await (async () => {
      const enc = new TextEncoder()
      const data = enc.encode(code)
      // Use subtle crypto if available else fallback to simple
      try {
        const buf = await crypto.subtle.digest('SHA-256', data)
        return Buffer.from(new Uint8Array(buf)).toString('hex')
      } catch {
        return code
      }
    })()

    await supabase.from('verification_attempts').insert({
      certificate_number: cert,
      verification_code_hash: hash,
      ip_address: ip,
      user_agent: ua,
      success,
    })
  } catch {}

  if (!success) {
    return NextResponse.json(payload, { status: payload.reason === 'Too many attempts, please try later' ? 429 : 404 })
  }
  return NextResponse.json(payload)
}
