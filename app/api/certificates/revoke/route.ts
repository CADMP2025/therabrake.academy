import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const certificateNumber = body?.certificateNumber as string
  const reason = (body?.reason as string) || 'Revoked by admin'
  if (!certificateNumber) {
    return NextResponse.json({ error: 'certificateNumber is required' }, { status: 400 })
  }

  const { data: updated, error } = await supabase
    .from('certificates')
    .update({ revoked: true, revoked_at: new Date().toISOString(), revoked_reason: reason })
    .eq('certificate_number', certificateNumber)
    .select('id, user_id, course_id')
    .limit(1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const row = updated?.[0]
  if (!row) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })

  try {
    await supabase.from('certificate_audit_log').insert({
      certificate_id: row.id,
      user_id: row.user_id,
      course_id: row.course_id,
      action: 'revoked',
      metadata: { by: user.id, admin_name: profile.full_name, reason },
    } as any)
  } catch {}

  return NextResponse.json({ ok: true })
}
