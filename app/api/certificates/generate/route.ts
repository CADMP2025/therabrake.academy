import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'
import { issueCertificate } from '@/lib/certificates/generators/issue'
import fs from 'node:fs/promises'
import path from 'node:path'
import { emailService } from '@/lib/email/email-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { enrollmentId } = body as { enrollmentId?: string }
    if (!enrollmentId) return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 })

    const supabase = await createSupabaseServerClient()
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth.user?.id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Validate enrollment completion
    const { data: enrollment, error: enrErr } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id, status, progress, completed_at')
      .eq('id', enrollmentId)
      .eq('user_id', userId)
      .maybeSingle()
    if (enrErr || !enrollment) return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    const isComplete = enrollment.status === 'completed' || Number(enrollment.progress || 0) >= 99.9
    if (!isComplete) return NextResponse.json({ error: 'Course not completed' }, { status: 400 })

    // Get course
    const { data: course, error: courseErr } = await supabase
      .from('courses')
      .select('id, title, ce_hours, provider_number')
      .eq('id', enrollment.course_id)
      .maybeSingle()
    if (courseErr || !course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Try to load optional signature image from public folder
    let signatureImageDataUrl: string | undefined
    try {
      const imgPath = path.join(process.cwd(), 'public', 'images', 'signature.png')
      const img = await fs.readFile(imgPath)
      const b64 = img.toString('base64')
      signatureImageDataUrl = `data:image/png;base64,${b64}`
    } catch {}

    const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`

    const result = await issueCertificate(supabase, {
      userId,
      courseId: course.id,
      enrollmentId: enrollment.id,
      courseTitle: course.title,
      providerNumber: course.provider_number,
      ceHours: Number(course.ce_hours || 0),
      issuedAt: enrollment.completed_at ? new Date(enrollment.completed_at) : new Date(),
      template: 'texas_lpc',
      signatureName: 'TheraBrake Academy',
      signatureTitle: 'Director of Education',
      signatureImageDataUrl,
      siteBaseUrl,
    })

    // Send email notification with PDF attachment (best effort)
    try {
      const userEmail = auth.user?.email || ''
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle()

      await emailService.sendCertificate(
        userEmail,
        profile?.full_name || 'Student',
        course.title,
        Number(course.ce_hours || 0),
        (enrollment.completed_at || new Date().toISOString()),
        result.pdfUrl,
        result.verificationCode,
        userId,
      )
    } catch (e) {
      console.error('Failed to send certificate email', e)
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Certificate generation error:', error)
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 })
  }
}
