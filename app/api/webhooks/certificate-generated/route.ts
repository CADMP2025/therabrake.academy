import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/email-service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    if (webhookSecret !== process.env.WEBHOOK_SECRET_CERTIFICATE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const certificateId = payload.record.id;

    // Fetch certificate data
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select(`
        id,
        user_id,
        course_id,
        completion_date,
        verification_code,
        certificate_url,
        user:users(email, full_name),
        course:courses(title, ce_hours)
      `)
      .eq('id', certificateId)
      .single();

    if (error || !certificate) {
      console.error('Failed to fetch certificate:', error);
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Send certificate email
    await emailService.sendCertificate(
      certificate.user.email,
      certificate.user.full_name,
      certificate.course.title,
      certificate.course.ce_hours,
      certificate.completion_date,
      certificate.certificate_url,
      certificate.verification_code,
      certificate.user_id
    );

    return NextResponse.json({ 
      success: true,
      message: 'Certificate delivered successfully'
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
