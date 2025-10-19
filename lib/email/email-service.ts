import { resend } from './resend-client';
import { emailTemplates } from './templates';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@therabrake.academy';

interface EmailLog {
  email_type: string;
  recipient_email: string;
  subject: string;
  status: 'sent' | 'failed';
  resend_id?: string;
  error_message?: string;
  user_id?: string;
}

async function logEmail(log: EmailLog) {
  try {
    await supabase.from('email_logs').insert({
      ...log,
      sent_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log email:', error);
  }
}

export const emailService = {
  async sendWelcomeEmail(email: string, name: string, verificationLink: string, userId?: string) {
    try {
      const template = emailTemplates.welcome({ name, verificationLink });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'welcome',
        recipient_email: email,
        subject: template.subject,
        status: error ? 'failed' : 'sent',
        resend_id: data?.id,
        error_message: error?.message,
        user_id: userId,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendEnrollmentConfirmation(
    email: string,
    studentName: string,
    courseName: string,
    courseUrl: string,
    ceHours: number,
    userId?: string
  ) {
    try {
      const template = emailTemplates.enrollmentConfirmation({ studentName, courseName, courseUrl, ceHours });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'enrollment_confirmation',
        recipient_email: email,
        subject: template.subject,
        status: error ? 'failed' : 'sent',
        resend_id: data?.id,
        error_message: error?.message,
        user_id: userId,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Failed to send enrollment confirmation:', error);
      return { success: false, error: error.message };
    }
  },

  async sendCertificate(
    email: string,
    studentName: string,
    courseName: string,
    ceHours: number,
    completionDate: string,
    certificateUrl: string,
    verificationCode: string,
    userId?: string
  ) {
    try {
      const template = emailTemplates.certificateDelivery({
        studentName, courseName, ceHours, completionDate, certificateUrl, verificationCode,
      });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'certificate_delivery',
        recipient_email: email,
        subject: template.subject,
        status: error ? 'failed' : 'sent',
        resend_id: data?.id,
        error_message: error?.message,
        user_id: userId,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Failed to send certificate:', error);
      return { success: false, error: error.message };
    }
  },

  async sendMFACode(email: string, name: string, code: string, userId?: string) {
    try {
      const template = emailTemplates.mfaCode({ name, code });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'mfa_code',
        recipient_email: email,
        subject: template.subject,
        status: error ? 'failed' : 'sent',
        resend_id: data?.id,
        error_message: error?.message,
        user_id: userId,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Failed to send MFA code:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPasswordReset(email: string, name: string, resetLink: string, userId?: string) {
    try {
      const template = emailTemplates.passwordReset({ name, resetLink });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'password_reset',
        recipient_email: email,
        subject: template.subject,
        status: error ? 'failed' : 'sent',
        resend_id: data?.id,
        error_message: error?.message,
        user_id: userId,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Failed to send password reset:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPaymentReceipt(
    email: string,
    studentName: string,
    amount: number,
    courseName: string,
    paymentDate: string,
    invoiceNumber: string,
    userId?: string
  ) {
    try {
      const template = emailTemplates.paymentReceipt({
        studentName, amount, courseName, paymentDate, invoiceNumber,
      });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'payment_receipt',
        recipient_email: email,
        subject: template.subject,
        status: error ? 'failed' : 'sent',
        resend_id: data?.id,
        error_message: error?.message,
        user_id: userId,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Failed to send payment receipt:', error);
      return { success: false, error: error.message };
    }
  },
};
