import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'welcome' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Test different email types
    let result;
    switch (type) {
      case 'welcome':
        result = await emailService.sendWelcomeEmail(
          email,
          'Test User',
          `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=test123`
        );
        break;

      case 'enrollment':
        result = await emailService.sendEnrollmentConfirmation(
          email,
          'Test User',
          'Test Course: Ethics in Counseling',
          `${process.env.NEXT_PUBLIC_APP_URL}/courses/test-course`,
          6
        );
        break;

      case 'certificate':
        result = await emailService.sendCertificate(
          email,
          'Test User',
          'Test Course: Ethics in Counseling',
          6,
          new Date().toISOString(),
          `${process.env.NEXT_PUBLIC_APP_URL}/certificates/test-cert.pdf`,
          'CERT-TEST-12345'
        );
        break;

      case 'mfa':
        result = await emailService.sendMFACode(
          email,
          'Test User',
          '123456'
        );
        break;

      case 'password':
        result = await emailService.sendPasswordReset(
          email,
          'Test User',
          `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=test123`
        );
        break;

      case 'receipt':
        result = await emailService.sendPaymentReceipt(
          email,
          'Test User',
          59.99,
          'Test Course: Ethics in Counseling',
          new Date().toISOString(),
          'INV-' + Date.now()
        );
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `${type} email sent successfully!` 
        : `Failed to send ${type} email`,
      data: result.data,
      error: result.error
    });

  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
