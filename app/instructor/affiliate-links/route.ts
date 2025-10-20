// app/api/instructor/affiliate-links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify user is instructor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!profile || !['instructor', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch affiliate links
    const { data: links, error: linksError } = await supabase
      .from('instructor_affiliate_links')
      .select('*')
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false });
    
    if (linksError) {
      console.error('Error fetching links:', linksError);
      return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
    }
    
    // Fetch commissions
    const { data: commissions } = await supabase
      .from('affiliate_commissions')
      .select('commission_amount, status')
      .eq('instructor_id', user.id);
    
    // Calculate stats
    const totalClicks = links?.reduce((sum, l) => sum + l.click_count, 0) || 0;
    const totalConversions = links?.reduce((sum, l) => sum + l.conversion_count, 0) || 0;
    const conversionRate = totalClicks > 0 
      ? ((totalConversions / totalClicks) * 100).toFixed(2)
      : '0.00';
    
    const totalCommissions = commissions?.reduce((sum, c) => sum + Number(c.commission_amount), 0) || 0;
    const pendingCommissions = commissions?.filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + Number(c.commission_amount), 0) || 0;
    const paidCommissions = commissions?.filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + Number(c.commission_amount), 0) || 0;
    
    return NextResponse.json({
      stats: {
        totalClicks,
        totalConversions,
        conversionRate: parseFloat(conversionRate),
        totalCommissions,
        pendingCommissions,
        paidCommissions
      },
      links: links || []
    });
    
  } catch (error) {
    console.error('Affiliate links GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get instructor profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();
    
    if (!profile || !['instructor', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Extract last name
    const nameParts = profile.full_name.split(' ');
    const lastName = nameParts[nameParts.length - 1] || 'USER';
    
    const body = await request.json();
    const targetType = body.targetType || 'platform';
    const targetId = body.targetId || null;
    
    // Generate unique code
    const { data: uniqueCode, error: codeError } = await supabase
      .rpc('generate_affiliate_code', {
        p_instructor_id: user.id,
        p_last_name: lastName
      });
    
    if (codeError || !uniqueCode) {
      console.error('Code generation error:', codeError);
      return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
    }
    
    // Create affiliate URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://therabrake.academy';
    const affiliateUrl = `${baseUrl}?ref=${uniqueCode}`;
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(affiliateUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#3B82F6',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
    
    const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    
    // Upload QR code
    const qrFileName = `qr-codes/${user.id}/${uniqueCode}.png`;
    
    const { error: uploadError } = await supabase.storage
      .from('affiliate-assets')
      .upload(qrFileName, qrBuffer, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (uploadError) {
      console.error('QR upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload QR' }, { status: 500 });
    }
    
    const { data: qrUrlData } = supabase.storage
      .from('affiliate-assets')
      .getPublicUrl(qrFileName);
    
    // Save to database
    const { data: linkData, error: linkError } = await supabase
      .from('instructor_affiliate_links')
      .insert({
        instructor_id: user.id,
        unique_code: uniqueCode,
        link_url: affiliateUrl,
        qr_code_url: qrUrlData.publicUrl,
        target_type: targetType,
        target_id: targetId,
        is_active: true
      })
      .select()
      .single();
    
    if (linkError) {
      console.error('Link save error:', linkError);
      return NextResponse.json({ error: 'Failed to save link' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, link: linkData }, { status: 201 });
    
  } catch (error) {
    console.error('Affiliate links POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}