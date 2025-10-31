import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const userId = auth.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const certificateId = String(form.get('certificateId') || '')
  const name = String(form.get('name') || '')
  const address1 = String(form.get('address1') || '')
  const address2 = String(form.get('address2') || '')
  const city = String(form.get('city') || '')
  const state = String(form.get('state') || '')
  const postal = String(form.get('postal') || '')

  if (!certificateId || !name || !address1 || !city || !state || !postal) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Ensure the certificate belongs to the user
  const { data: cert } = await supabase
    .from('certificates')
    .select('id, user_id')
    .eq('id', certificateId)
    .eq('user_id', userId)
    .maybeSingle()
  if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('certificate_mail_requests')
    .insert({
      user_id: userId,
      certificate_id: certificateId,
      name,
      address1,
      address2: address2 || null,
      city,
      state,
      postal,
      status: 'requested',
    })
    .select('id')
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.redirect(new URL(`/student/certificates/${certificateId}?mailRequest=${data?.id}`, req.url), 303)
}
