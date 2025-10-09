// app/api/webhooks/certificate-generated/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { certificate_id } = body

    if (!certificate_id) {
      return NextResponse.json(
        { error: 'Certificate ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: certificate, error } = await supabase
      .from('certificates')
      .select(`
        *,
        user:profiles!certificates_user_id_fkey (
          email,
          full_name
        ),
        course:courses!certificates_course_id_fkey (
          title,
          ce_hours
        )
      `)
      .eq('id', certificate_id)
      .single()

    if (error || !certificate) {
      console.error('Certificate fetch error:', error)
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    if (!certificate.user || !certificate.course) {
      return NextResponse.json(
        { error: 'Invalid certificate data' },
        { status: 400 }
      )
    }

    // TODO: Implement email service
    // await emailService.sendCertificate(...)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Certificate webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
