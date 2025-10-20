// utils/affiliate-link-generator.ts
import QRCode from 'qrcode';

export async function generateAffiliateLink(instructorId: string) {
  // Generate unique code
  const uniqueCode = await generateUniqueCode();
  
  // Create affiliate link
  const affiliateUrl = `https://therabrake.academy?ref=${uniqueCode}`;
  
  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(affiliateUrl, {
    width: 400,
    margin: 2,
    color: {
      dark: '#3B82F6', // TheraBrake blue
      light: '#FFFFFF'
    }
  });
  
  // Upload QR code to storage
  const qrFileName = `qr-codes/${instructorId}-${uniqueCode}.png`;
  const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
  
  const { data: qrUpload } = await supabase.storage
    .from('affiliate-assets')
    .upload(qrFileName, qrBuffer, {
      contentType: 'image/png'
    });
  
  const { data: qrUrl } = supabase.storage
    .from('affiliate-assets')
    .getPublicUrl(qrFileName);
  
  // Save to database
  await supabase
    .from('instructor_affiliate_links')
    .insert({
      instructor_id: instructorId,
      unique_code: uniqueCode,
      link_url: affiliateUrl,
      qr_code_url: qrUrl.publicUrl,
      target_type: 'platform'
    });
  
  return { affiliateUrl, qrCodeUrl: qrUrl.publicUrl, uniqueCode };
}

async function generateUniqueCode(): Promise<string> {
  // Generate format: FIRSTNAME-RANDOM (e.g., "SMITH-K8N2")
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array(4)
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
  
  return `${instructorLastName.toUpperCase()}-${random}`;
}