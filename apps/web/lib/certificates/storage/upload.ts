import type { SupabaseClient } from '@supabase/supabase-js'

export async function uploadCertificatePdf(
  supabase: SupabaseClient,
  userId: string,
  courseId: string,
  certificateNumber: string,
  pdf: Buffer
): Promise<string> {
  const bucket = process.env.NEXT_PUBLIC_CERT_BUCKET || 'certificates'
  const path = `${userId}/${courseId}/${certificateNumber}.pdf`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, pdf, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (error) throw error

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}
