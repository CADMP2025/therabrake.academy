import crypto from 'crypto'
import QRCode from 'qrcode'
import { format } from 'date-fns'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function generateVerificationCode(length = 12, supabase?: SupabaseClient): Promise<string> {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no confusing chars
  const bytes = crypto.randomBytes(length)
  let code = ''
  for (let i = 0; i < length; i++) {
    code += alphabet[bytes[i] % alphabet.length]
  }

  if (!supabase) return code

  // Ensure uniqueness if client provided
  const { data } = await supabase
    .from('certificates')
    .select('id')
    .eq('verification_code', code)
    .limit(1)

  if (data && data.length > 0) {
    return generateVerificationCode(length, supabase)
  }
  return code
}

export async function generateCertificateNumber(courseCode: string, supabase?: SupabaseClient): Promise<string> {
  const today = new Date()
  const yyyymmdd = format(today, 'yyyyMMdd')
  const prefix = `${courseCode}-${yyyymmdd}`

  let seq = Math.floor(Math.random() * 900) + 100 // fallback seq

  if (supabase) {
    // Find how many certificates already exist today for this courseCode
    const { count } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .ilike('certificate_number', `${prefix}-%`)

    const next = (count ?? 0) + 1
    seq = next
  }

  return `${prefix}-${String(seq).padStart(3, '0')}`
}

export async function computeCeHours(
  supabase: SupabaseClient,
  courseId: string
): Promise<number> {
  // Try precise calculation from modules/lessons duration
  const { data: modules } = await supabase
    .from('modules')
    .select('duration_minutes')
    .eq('course_id', courseId)

  const { data: lessons } = await supabase
    .from('lessons')
    .select('duration_minutes')
    .eq('course_id', courseId)

  const totalMinutes = (modules?.reduce((s, m) => s + (m.duration_minutes || 0), 0) || 0)
    + (lessons?.reduce((s, l) => s + (l.duration_minutes || 0), 0) || 0)

  let hours = Math.round((totalMinutes / 60) * 10) / 10 // one decimal

  if (!hours || hours <= 0) {
    // Fallback to course.ce_hours
    const { data: course } = await supabase
      .from('courses')
      .select('ce_hours')
      .eq('id', courseId)
      .maybeSingle()
    hours = Number(course?.ce_hours || 0)
  }

  return hours
}

export async function makeQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 0 })
}

export function makeSigningHash(payload: Record<string, any>): string {
  const secret = process.env.CERT_SIGNING_SECRET || process.env.NEXT_PUBLIC_CERT_SIGNING_SECRET || 'dev-secret'
  const json = JSON.stringify(payload)
  return crypto.createHmac('sha256', secret).update(json).digest('hex')
}

export function courseCodeFromTitle(title: string): string {
  return title
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 8)
}
