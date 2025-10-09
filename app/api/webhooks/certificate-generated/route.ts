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
      console.error('Certificate webhook authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const certificateId = payload.record.id;

    // Fetch complete certificate data with related user and course
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select(`
        id,
        user_id,
        course_id,
        completion_date,
        verification_code,
        certificate_url,
        ce_hours,
        user:users(
          email,
          full_name,
          license_number,
          license_type
        ),
        course:courses(
          title,
          ce_hours,
          ce_provider,
          instructor_id,
          instructor:users!courses_instructor_id_fkey(full_name)
        )
      `)
      .eq('id', certificateId)
      .single();

    if (error) {
      console.error('Failed to fetch certificate data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch certificate', details: error.message },
        { status: 500 }
      );
    }

    if (!certificate || !certificate.user || !certificate.course) {
      console.error('Incomplete certificate data:', certificateId);
      return NextResponse.json(
        { error: 'Incomplete certificate data' },
        { status: 404 }
      );
    }

    // Download certificate PDF from Supabase Storage
    let certificatePdfBuffer: Buffer | null = null;
    
    if (certificate.certificate_url) {
      try {
        // Extract the file path from the URL
        const url = new URL(certificate.certificate_url);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf('certificates');
        
        if (bucketIndex !== -1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          
          const { data: pdfData, error: downloadError } = await supabase
            .storage
            .from('certificates')
            .download(filePath);

          if (downloadError) {
            console.error('Failed to download certificate PDF:', downloadError);
          } else if (pdfData) {
            certificatePdfBuffer = Buffer.from(await pdfData.arrayBuffer());
            console.log('Certificate PDF downloaded successfully');
          }
        }
      } catch (downloadError) {
        console.error('Error processing certificate URL:', downloadError);
        // Continue without PDF attachment - still send email
      }
    }

    // Send certificate email to user
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificate.verification_code}`;
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
      
      const emailData: any = {
        to: certificate.user.email,
        subject: `Your CE Certificate - ${certificate.course.title}`,
        template: 'certificate-completion',
        data: {
          studentName: certificate.user.full_name,
          courseTitle: certificate.course.title,
          ceHours: certificate.ce_hours || certificate.course.ce_hours,
          completionDate: new Date(certificate.completion_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          verificationCode: certificate.verification_code,
          verificationUrl,
          certificateUrl: certificate.certificate_url,
          dashboardUrl,
          instructorName: certificate.course.instructor?.full_name,
          licenseNumber: certificate.user.license_number,
          licenseType: certificate.user.license_type,
        }
      };

      // Add PDF attachment if available
      if (certificatePdfBuffer) {
        emailData.attachments = [
          {
            filename: `CE_Certificate_${certificate.verification_code}.pdf`,
            content: certificatePdfBuffer,
            contentType: 'application/pdf',
          }
        ];
      }

      await emailService.sendEmail(emailData);

      console.log(`Certificate email sent to ${certificate.user.email}`);
    } catch (emailError) {
      console.error('Failed to send certificate email:', emailError);
      // Don't fail the webhook if email fails - certificate is still generated
    }

    // Log certificate delivery for compliance audit trail
    try {
      await supabase
        .from('certificate_audit_log')
        .insert({
          certificate_id: certificate.id,
          user_id: certificate.user_id,
          course_id: certificate.course_id,
          action: 'email_sent',
          email_address: certificate.user.email,
          verification_code: certificate.verification_code,
          metadata: {
            attachment_included: !!certificatePdfBuffer,
            ce_hours: certificate.ce_hours || certificate.course.ce_hours,
            license_number: certificate.user.license_number,
          }
        });

      console.log('Certificate delivery logged for audit trail');
    } catch (auditError) {
      console.error('Failed to log certificate delivery:', auditError);
      // Don't fail the webhook if audit logging fails
    }

    return NextResponse.json({
      success: true,
      certificateId,
      message: 'Certificate processed and email sent successfully'
    });

  } catch (error) {
    console.error('Certificate webhook error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
