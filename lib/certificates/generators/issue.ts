import type { SupabaseClient } from '@supabase/supabase-js'
import { computeCeHours, courseCodeFromTitle, generateCertificateNumber, generateVerificationCode, makeQrDataUrl, makeSigningHash } from '../utils'
import type { CertificateIssueInput, CertificateIssueResult, CertificateRenderData } from '../types'
import { renderCertificateToPdfBuffer } from './pdf'
import { uploadCertificatePdf } from '../storage/upload'

export async function issueCertificate(
  supabase: SupabaseClient,
  input: CertificateIssueInput & {
    signatureName?: string
    signatureTitle?: string
    signatureImageDataUrl?: string
    siteBaseUrl?: string
  }
): Promise<CertificateIssueResult> {
  const issuedAt = input.issuedAt ?? new Date()

  // Fetch user full name and license
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('full_name, license_number, license_state')
    .eq('id', input.userId)
    .maybeSingle()
  if (profileErr) throw profileErr

  // CE hours
  const ceHours = input.ceHours > 0 ? input.ceHours : await computeCeHours(supabase, input.courseId)

  const courseCode = courseCodeFromTitle(input.courseTitle)
  const certificateNumber = await generateCertificateNumber(courseCode, supabase)
  const verificationCode = await generateVerificationCode(12, supabase)

  const baseUrl = input.siteBaseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://therabrake.academy'
  const verifyUrl = `${baseUrl}/verify?cert=${encodeURIComponent(certificateNumber)}&code=${encodeURIComponent(verificationCode)}`
  const qrDataUrl = await makeQrDataUrl(verifyUrl)

  const signingPayload = {
    certificateNumber,
    verificationCode,
    userId: input.userId,
    courseId: input.courseId,
    enrollmentId: input.enrollmentId,
    issuedAt: issuedAt.toISOString(),
    ceHours,
  }
  const signingHash = makeSigningHash(signingPayload)

  const renderData: CertificateRenderData = {
    certificateNumber,
    verificationCode,
    qrDataUrl,
    courseTitle: input.courseTitle,
    ceHours,
    userFullName: profile?.full_name || 'Student',
    licenseNumber: input.licenseNumber ?? profile?.license_number,
    licenseState: input.licenseState ?? profile?.license_state ?? 'TX',
    providerNumber: input.providerNumber || undefined,
    issuedAt,
    expiresAt: input.expiresAt || null,
    signatureName: input.signatureName || 'TheraBrake Academy',
    signatureTitle: input.signatureTitle || 'Director of Education',
    signatureImageDataUrl: input.signatureImageDataUrl,
    signingHash,
  }

  const pdf = await renderCertificateToPdfBuffer(renderData)
  const pdfUrl = await uploadCertificatePdf(supabase, input.userId, input.courseId, certificateNumber, pdf)

  // Persist row
  const { data: row, error: insertErr } = await supabase
    .from('certificates')
    .insert({
      user_id: input.userId,
      course_id: input.courseId,
      enrollment_id: input.enrollmentId,
      certificate_number: certificateNumber,
      ce_hours: ceHours,
      issued_at: issuedAt.toISOString(),
      expires_at: input.expiresAt ? input.expiresAt.toISOString() : null,
      pdf_url: pdfUrl,
      verification_code: verificationCode,
    })
    .select('id')
    .maybeSingle()
  if (insertErr) throw insertErr

  // Audit log (best effort)
  await supabase.from('certificate_audit_log').insert({
    certificate_id: row?.id,
    user_id: input.userId,
    course_id: input.courseId,
    action: 'generated',
    verification_code: verificationCode,
    metadata: signingPayload as any,
  })

  return {
    certificateId: row?.id as string,
    certificateNumber,
    verificationCode,
    pdfUrl,
  }
}
