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

async function wasEmailSentRecently(emailType: string, userId?: string, hours: number = 24) {
  if (!userId) return false;
  try {
    const { data, error } = await (supabase as any).rpc('was_email_sent_recently', {
      user_id: userId,
      email_type: emailType,
      within_hours: hours,
    });
    if (error) {
      console.warn('was_email_sent_recently RPC error (continuing without dedup):', error.message);
      return false;
    }
    return !!data;
  } catch (e: any) {
    console.warn('was_email_sent_recently RPC failed (continuing without dedup):', e?.message || e);
    return false;
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

  async sendOnboardingDay3(email: string, name: string, dashboardUrl: string, tourUrl: string, userId?: string) {
    try {
      if (await wasEmailSentRecently('onboarding_day_3', userId, 24)) {
        return { success: true, skipped: true };
      }
      const template = emailTemplates.onboardingDay3({ name, dashboardUrl, tourUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'onboarding_day_3',
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
      console.error('Failed to send onboarding day 3:', error);
      return { success: false, error: error.message };
    }
  },

  async sendOnboardingDay7(email: string, name: string, recommendationsHtml: string, exploreUrl: string, userId?: string) {
    try {
      if (await wasEmailSentRecently('onboarding_day_7', userId, 24)) {
        return { success: true, skipped: true };
      }
      const template = emailTemplates.onboardingDay7({ name, recommendationsHtml, exploreUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'onboarding_day_7',
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
      console.error('Failed to send onboarding day 7:', error);
      return { success: false, error: error.message };
    }
  },

  async sendProfileCompletionReminder(email: string, name: string, profileUrl: string, userId?: string) {
    try {
      if (await wasEmailSentRecently('profile_completion_reminder', userId, 72)) {
        return { success: true, skipped: true };
      }
      const template = emailTemplates.profileCompletionReminder({ name, profileUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'profile_completion_reminder',
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
      console.error('Failed to send profile completion reminder:', error);
      return { success: false, error: error.message };
    }
  },

  async sendFirstPurchaseCelebration(email: string, name: string, courseName: string, dashboardUrl: string, userId?: string) {
    try {
      const template = emailTemplates.firstPurchaseCelebration({ name, courseName, dashboardUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'first_purchase_celebration',
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
      console.error('Failed to send first purchase celebration:', error);
      return { success: false, error: error.message };
    }
  },

  async sendLessonCompleted(email: string, name: string, courseName: string, lessonTitle: string, resumeUrl: string, userId?: string) {
    try {
      const template = emailTemplates.lessonCompleted({ name, courseName, lessonTitle, resumeUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'lesson_completed',
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
      console.error('Failed to send lesson completed:', error);
      return { success: false, error: error.message };
    }
  },

  async sendQuizPassed(email: string, name: string, quizTitle: string, score: number, courseUrl: string, userId?: string) {
    try {
      const template = emailTemplates.quizPassed({ name, quizTitle, score, courseUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'quiz_passed',
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
      console.error('Failed to send quiz passed email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendQuizFailed(email: string, name: string, quizTitle: string, score: number, reviewUrl: string, userId?: string) {
    try {
      const template = emailTemplates.quizFailed({ name, quizTitle, score, reviewUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'quiz_failed',
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
      console.error('Failed to send quiz failed email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendNewLessonAvailable(email: string, courseName: string, lessonTitle: string, lessonUrl: string, userId?: string) {
    try {
      const template = emailTemplates.newLessonAvailable({ courseName, lessonTitle, lessonUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'new_lesson_available',
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
      console.error('Failed to send new lesson available:', error);
      return { success: false, error: error.message };
    }
  },

  async sendInactivity(email: string, name: string, days: number, resumeUrl: string, offerHtml?: string, userId?: string) {
    try {
      const emailType = `inactivity_${days}_days`;
      if (await wasEmailSentRecently(emailType, userId, 24)) {
        return { success: true, skipped: true };
      }
      const template = emailTemplates.inactivity({ name, days, resumeUrl, offerHtml });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: emailType,
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
      console.error('Failed to send inactivity email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendAbandonedCart(email: string, name: string, checkoutUrl: string, courseName?: string, userId?: string) {
    try {
      if (await wasEmailSentRecently('abandoned_cart', userId, 24)) {
        return { success: true, skipped: true };
      }
      const template = emailTemplates.abandonedCart({ name, checkoutUrl, courseName });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'abandoned_cart',
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
      console.error('Failed to send abandoned cart email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendMonthlySummary(
    email: string,
    name: string,
    ceHours: number,
    lessonsCompleted: number,
    summaryHtml: string,
    dashboardUrl: string,
    userId?: string
  ) {
    try {
      const template = emailTemplates.monthlySummary({ name, ceHours, lessonsCompleted, summaryHtml, dashboardUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'monthly_summary',
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
      console.error('Failed to send monthly summary:', error);
      return { success: false, error: error.message };
    }
  },

  async sendStreakNotification(email: string, name: string, streakDays: number, dashboardUrl: string, userId?: string) {
    try {
      const template = emailTemplates.streakNotification({ name, streakDays, dashboardUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'streak_notification',
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
      console.error('Failed to send streak notification:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPaymentFailed(email: string, name: string, amount: number, retryUrl: string, userId?: string) {
    try {
      const template = emailTemplates.paymentFailed({ name, amount, retryUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'payment_failed',
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
      console.error('Failed to send payment failed:', error);
      return { success: false, error: error.message };
    }
  },

  async sendSubscriptionRenewalReminder(email: string, name: string, renewDate: string, manageUrl: string, userId?: string) {
    try {
      const template = emailTemplates.subscriptionRenewalReminder({ name, renewDate, manageUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'subscription_renewal_reminder',
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
      console.error('Failed to send subscription renewal reminder:', error);
      return { success: false, error: error.message };
    }
  },

  async sendSubscriptionRenewed(email: string, name: string, renewDate: string, invoiceUrl?: string, userId?: string) {
    try {
      const template = emailTemplates.subscriptionRenewed({ name, renewDate, invoiceUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'subscription_renewed',
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
      console.error('Failed to send subscription renewed:', error);
      return { success: false, error: error.message };
    }
  },

  async sendRefundProcessed(email: string, name: string, amount: number, refundDate: string, userId?: string) {
    try {
      const template = emailTemplates.refundProcessed({ name, amount, refundDate });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'refund_processed',
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
      console.error('Failed to send refund processed:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPaymentMethodExpiring(email: string, name: string, last4: string, expiry: string, manageUrl: string, userId?: string) {
    try {
      const template = emailTemplates.paymentMethodExpiring({ name, last4, expiry, manageUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'payment_method_expiring',
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
      console.error('Failed to send payment method expiring:', error);
      return { success: false, error: error.message };
    }
  },

  async sendSecurityAlert(email: string, name: string, event: string, manageUrl: string, ip?: string, location?: string, userId?: string) {
    try {
      const template = emailTemplates.securityAlert({ name, event, ip, location, manageUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'security_alert',
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
      console.error('Failed to send security alert:', error);
      return { success: false, error: error.message };
    }
  },

  async sendSuspiciousActivity(email: string, name: string, description: string, manageUrl: string, userId?: string) {
    try {
      const template = emailTemplates.suspiciousActivity({ name, description, manageUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'suspicious_activity',
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
      console.error('Failed to send suspicious activity:', error);
      return { success: false, error: error.message };
    }
  },

  async sendMaintenanceAnnouncement(email: string, window: string, statusUrl: string, userId?: string) {
    try {
      const template = emailTemplates.maintenanceAnnouncement({ window, statusUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'maintenance_announcement',
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
      console.error('Failed to send maintenance announcement:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPrivacyPolicyUpdate(email: string, effectiveDate: string, policyUrl: string, userId?: string) {
    try {
      const template = emailTemplates.privacyPolicyUpdate({ effectiveDate, policyUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'privacy_policy_update',
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
      console.error('Failed to send privacy policy update:', error);
      return { success: false, error: error.message };
    }
  },

  async sendSupportTicketConfirmation(email: string, ticketId: string, subject: string, viewUrl: string, userId?: string) {
    try {
      const template = emailTemplates.supportTicketConfirmation({ ticketId, subject, viewUrl });
      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
      });
      await logEmail({
        email_type: 'support_ticket_confirmation',
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
      console.error('Failed to send support ticket confirmation:', error);
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
      // Attempt to attach PDF
      let attachments: any[] | undefined
      try {
        const resp = await fetch(certificateUrl)
        if (resp.ok) {
          const blob = await resp.arrayBuffer()
          const base64 = Buffer.from(blob).toString('base64')
          attachments = [{ filename: `${courseName}-certificate.pdf`, content: base64 }]
        }
      } catch (e) {
        console.warn('Attachment fetch failed; sending without attachment')
      }

      const { data, error } = await resend.emails.send({
        from: template.from || DEFAULT_FROM,
        subject: template.subject,
        html: template.html,
        to: email,
        attachments,
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
