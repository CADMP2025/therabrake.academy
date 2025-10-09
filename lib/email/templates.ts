import { FROM_EMAIL, FROM_NAME } from './resend-client';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const emailTemplates = {
  welcome: (data: { name: string; verificationLink: string }): EmailTemplate => ({
    to: '',
    subject: 'Welcome to TheraBrake Academy',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to TheraBrake Academy</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>Thank you for joining TheraBrake Academy! We're excited to support your continuing education journey as a mental health professional in Texas.</p>
              <p>To get started, please verify your email address by clicking the button below:</p>
              <center>
                <a href="${data.verificationLink}" class="button">Verify Email Address</a>
              </center>
              <p>Once verified, you'll have full access to our Texas LPC-approved CE courses, the innovative cut & paste course builder, and all platform features.</p>
              <p>If you have any questions, our support team is here to help at support@therabrake.academy</p>
              <p>Best regards,<br>The TheraBrake Academy Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TheraBrake Academy. All rights reserved.</p>
              <p>Texas LPC Board Approved Provider</p>
            </div>
          </div>
        </body>
      </html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  enrollmentConfirmation: (data: { 
    studentName: string; 
    courseName: string; 
    courseUrl: string;
    ceHours: number;
  }): EmailTemplate => ({
    to: '',
    subject: `Enrollment Confirmed: ${data.courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
            .course-info { background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #10B981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Enrollment Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.studentName},</h2>
              <p>You're now enrolled in:</p>
              <div class="course-info">
                <h3 style="margin-top: 0; color: #3B82F6;">${data.courseName}</h3>
                <p style="margin: 10px 0;"><strong>CE Hours:</strong> ${data.ceHours} Texas LPC-approved hours</p>
              </div>
              <p>You can start learning immediately by accessing your course dashboard:</p>
              <center>
                <a href="${data.courseUrl}" class="button">Start Learning</a>
              </center>
              <p><strong>Important Reminders:</strong></p>
              <ul>
                <li>Complete all modules and quizzes to receive your CE certificate</li>
                <li>Certificates are automatically generated upon course completion</li>
                <li>Track your progress in the student dashboard</li>
                <li>Course access is lifetime - learn at your own pace</li>
              </ul>
              <p>Questions? Contact us at support@therabrake.academy</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TheraBrake Academy</p>
            </div>
          </div>
        </body>
      </html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  certificateDelivery: (data: {
    studentName: string;
    courseName: string;
    ceHours: number;
    completionDate: string;
    certificateUrl: string;
    verificationCode: string;
  }): EmailTemplate => ({
    to: '',
    subject: `Your CE Certificate: ${data.courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FACC15 0%, #F97316 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
            .cert-info { background: #fef3c7; padding: 20px; border-left: 4px solid #FACC15; margin: 20px 0; }
            .button { display: inline-block; background: #F97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .verification { font-family: monospace; background: #f3f4f6; padding: 10px; border-radius: 4px; display: inline-block; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.studentName},</h2>
              <p>Congratulations on completing <strong>${data.courseName}</strong>!</p>
              <div class="cert-info">
                <p style="margin: 0;"><strong>CE Hours Earned:</strong> ${data.ceHours} hours</p>
                <p style="margin: 10px 0 0 0;"><strong>Completion Date:</strong> ${new Date(data.completionDate).toLocaleDateString()}</p>
              </div>
              <p>Your Texas LPC-approved CE certificate is ready for download:</p>
              <center>
                <a href="${data.certificateUrl}" class="button">Download Certificate</a>
              </center>
              <p><strong>Certificate Verification Code:</strong><br>
              <span class="verification">${data.verificationCode}</span></p>
              <p><small>This verification code can be used by licensing boards to confirm the authenticity of your certificate.</small></p>
              <p><strong>Important Information:</strong></p>
              <ul>
                <li>Keep this certificate for your records (4-year retention required)</li>
                <li>Submit to the Texas LPC board as part of your renewal application</li>
                <li>You can always re-download from your student dashboard</li>
                <li>Certificates are stored securely for 7 years minimum</li>
              </ul>
              <p>Thank you for choosing TheraBrake Academy for your continuing education!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TheraBrake Academy</p>
              <p>Texas LPC Board Approved Provider</p>
            </div>
          </div>
        </body>
      </html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  mfaCode: (data: { name: string; code: string }): EmailTemplate => ({
    to: '',
    subject: 'Your TheraBrake Academy Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
            .code { font-size: 32px; font-weight: bold; color: #3B82F6; text-align: center; letter-spacing: 8px; margin: 30px 0; font-family: monospace; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Verification Code</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>Your verification code for TheraBrake Academy is:</p>
              <div class="code">${data.code}</div>
              <p style="text-align: center;"><small>This code expires in 10 minutes</small></p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. TheraBrake Academy staff will never ask for your verification code.
              </div>
              <p>If you didn't request this code, please contact security@therabrake.academy immediately.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TheraBrake Academy</p>
            </div>
          </div>
        </body>
      </html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  passwordReset: (data: { name: string; resetLink: string }): EmailTemplate => ({
    to: '',
    subject: 'Reset Your TheraBrake Academy Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>We received a request to reset your TheraBrake Academy password.</p>
              <p>Click the button below to create a new password:</p>
              <center>
                <a href="${data.resetLink}" class="button">Reset Password</a>
              </center>
              <p style="text-align: center;"><small>This link expires in 1 hour</small></p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and contact security@therabrake.academy if you have concerns.
              </div>
              <p>For your security, this link can only be used once and will expire after 1 hour.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TheraBrake Academy</p>
            </div>
          </div>
        </body>
      </html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  paymentReceipt: (data: {
    studentName: string;
    amount: number;
    courseName: string;
    paymentDate: string;
    invoiceNumber: string;
  }): EmailTemplate => ({
    to: '',
    subject: `Payment Receipt - Invoice #${data.invoiceNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
            .invoice { background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { font-size: 24px; font-weight: bold; color: #10B981; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Payment Received</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.studentName},</h2>
              <p>Thank you for your payment! Here's your receipt:</p>
              <div class="invoice">
                <h3 style="margin-top: 0;">Invoice #${data.invoiceNumber}</h3>
                <div class="row">
                  <span>Date:</span>
                  <span>${new Date(data.paymentDate).toLocaleDateString()}</span>
                </div>
                <div class="row">
                  <span>Course:</span>
                  <span>${data.courseName}</span>
                </div>
                <hr style="border: none; border-top: 1px solid #d1d5db; margin: 20px 0;">
                <div class="row total">
                  <span>Total Paid:</span>
                  <span>$${data.amount.toFixed(2)}</span>
                </div>
              </div>
              <p>This receipt serves as confirmation of your payment. For tax purposes, please retain this email for your records.</p>
              <p>Your enrollment is now active and you can begin your course immediately.</p>
              <p>Questions about your purchase? Contact support@therabrake.academy</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} TheraBrake Academy</p>
              <p>TIN: [Your Tax ID Number]</p>
            </div>
          </div>
        </body>
      </html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),
};
