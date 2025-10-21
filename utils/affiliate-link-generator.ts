import { createClient } from '@/lib/supabase/client'
import QRCode from 'qrcode'

interface AffiliateLink {
  id: string
  unique_code: string
  link_url: string
  qr_code_url?: string
}

export async function generateAffiliateLink(
  instructorId: string,
  targetType: 'platform' | 'course' = 'platform',
  targetCourseId?: string
): Promise<AffiliateLink> {
  const supabase = createClient()
  
  // Generate unique code
  const uniqueCode = generateUniqueCode()
  
  // Build link URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://therabrake.academy'
  const linkUrl = targetType === 'course' && targetCourseId
    ? `${baseUrl}/courses/${targetCourseId}?ref=${uniqueCode}`
    : `${baseUrl}?ref=${uniqueCode}`
  
  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(linkUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: '#3B82F6',
      light: '#FFFFFF'
    }
  })
  
  // Upload QR code to storage
  const qrFileName = `qr-codes/${instructorId}/${uniqueCode}.png`
  const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')
  
  const { data: qrUpload } = await supabase.storage
    .from('affiliate-assets')
    .upload(qrFileName, qrBuffer, {
      contentType: 'image/png',
      upsert: true
    })
  
  // Get public URL for QR code
  const { data: { publicUrl } } = supabase.storage
    .from('affiliate-assets')
    .getPublicUrl(qrFileName)
  
  // Create affiliate link record
  const { data, error } = await supabase
    .from('instructor_affiliate_links')
    .insert({
      instructor_id: instructorId,
      unique_code: uniqueCode,
      link_url: linkUrl,
      qr_code_url: publicUrl,
      target_type: targetType,
      target_course_id: targetCourseId,
      is_active: true
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to create affiliate link: ${error.message}`)
  }
  
  return data
}

function generateUniqueCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return code
}

export async function getAffiliateLinks(instructorId: string): Promise<AffiliateLink[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('instructor_affiliate_links')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to fetch affiliate links: ${error.message}`)
  }
  
  return data || []
}

export async function deactivateAffiliateLink(linkId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('instructor_affiliate_links')
    .update({ is_active: false })
    .eq('id', linkId)
  
  if (error) {
    throw new Error(`Failed to deactivate affiliate link: ${error.message}`)
  }
}
