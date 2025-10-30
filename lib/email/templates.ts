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

  onboardingDay3: (data: { name: string; dashboardUrl: string; tourUrl: string }): EmailTemplate => ({
    to: '',
    subject: "Welcome tour: make the most of TheraBrake (Day 3)",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 26px; }
            .content { background: white; padding: 36px 28px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 16px 0; }
            .footer { text-align: center; padding: 18px; color: #6b7280; font-size: 14px; }
            .tip { background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 14px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Let’s take a quick tour</h1></div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>On Day 3, we recommend a quick tour so you can find everything fast:</p>
              <div class="tip">
                <ul>
                  <li>Where to resume a course and track CE hours</li>
                  <li>How to download certificates</li>
                  <li>Finding Texas LPC-approved courses</li>
                </ul>
              </div>
              <center>
                <a class="button" href="${data.tourUrl}">Take the 2‑minute tour</a>
              </center>
              <p>Ready to learn? Jump back to your dashboard anytime.</p>
              <center>
                <a class="button" href="${data.dashboardUrl}">Go to Dashboard</a>
              </center>
            </div>
            <div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div>
          </div>
        </body>
      </html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  onboardingDay7: (data: { name: string; recommendationsHtml: string; exploreUrl: string }): EmailTemplate => ({
    to: '',
    subject: "Day 7 check‑in: course recommendations for you",
    html: `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:linear-gradient(135deg,#10B981 0%,#3B82F6 100%);padding:40px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:26px}
      .content{background:#fff;padding:36px 28px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#10B981;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .recos{background:#F0FDFA;border-left:4px solid #10B981;padding:14px;border-radius:4px}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>How’s it going, ${data.name}?</h1></div>
      <div class="content">
      <p>Here are some recommended courses to help you earn CE hours efficiently:</p>
      <div class="recos">${data.recommendationsHtml}</div>
      <center><a class="button" href="${data.exploreUrl}">Explore Courses</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  profileCompletionReminder: (data: { name: string; profileUrl: string }): EmailTemplate => ({
    to: '',
    subject: "Complete your profile to personalize your CE journey",
    html: `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#6366F1;padding:36px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:32px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#6366F1;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Finish setting up your account</h1></div>
      <div class="content"><p>Hi ${data.name}, complete your profile so we can tailor course recommendations and certificates:</p>
      <ul><li>License info for CE certificates</li><li>Interests to personalize courses</li><li>Preferred notifications</li></ul>
      <center><a class="button" href="${data.profileUrl}">Complete Profile</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  firstPurchaseCelebration: (data: { name: string; courseName: string; dashboardUrl: string }): EmailTemplate => ({
    to: '',
    subject: `🎉 Thanks for your first purchase: ${data.courseName}`,
    html: `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:linear-gradient(135deg,#F59E0B 0%,#EF4444 100%);padding:40px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:26px}
      .content{background:#fff;padding:36px 28px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#F59E0B;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Welcome to your first course!</h1></div>
      <div class="content"><p>Hi ${data.name}, we’re excited you chose <strong>${data.courseName}</strong>. You can start anytime and earn CE hours at your pace.</p>
      <center><a class="button" href="${data.dashboardUrl}">Go to My Courses</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  lessonCompleted: (data: { name: string; courseName: string; lessonTitle: string; resumeUrl: string }): EmailTemplate => ({
    to: '',
    subject: `✅ Lesson completed: ${data.lessonTitle}`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#10B981;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#10B981;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Nice work, ${data.name}!</h1></div>
      <div class="content"><p>You completed <strong>${data.lessonTitle}</strong> in <em>${data.courseName}</em>.</p>
      <center><a class="button" href="${data.resumeUrl}">Continue to the next lesson</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  quizPassed: (data: { name: string; quizTitle: string; score: number; courseUrl: string }): EmailTemplate => ({
    to: '',
    subject: `🎉 You passed: ${data.quizTitle} (${data.score}%)`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:linear-gradient(135deg,#10B981 0%,#059669 100%);padding:36px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:26px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#3B82F6;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Great job!</h1></div>
      <div class="content"><p>You passed <strong>${data.quizTitle}</strong> with <strong>${data.score}%</strong>.</p>
      <center><a class="button" href="${data.courseUrl}">Continue Learning</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  quizFailed: (data: { name: string; quizTitle: string; score: number; reviewUrl: string }): EmailTemplate => ({
    to: '',
    subject: `Keep going: ${data.quizTitle} results (${data.score}%)`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:linear-gradient(135deg,#EF4444 0%,#DC2626 100%);padding:36px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:26px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#3B82F6;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>You’ve got this</h1></div>
      <div class="content"><p>You scored <strong>${data.score}%</strong> on <strong>${data.quizTitle}</strong>. Review the materials and try again in 24 hours.</p>
      <center><a class="button" href="${data.reviewUrl}">Review Course Materials</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  newLessonAvailable: (data: { courseName: string; lessonTitle: string; lessonUrl: string }): EmailTemplate => ({
    to: '',
    subject: `New lesson available: ${data.lessonTitle}`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#3B82F6;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#3B82F6;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>New content in ${data.courseName}</h1></div>
      <div class="content"><p>We’ve added <strong>${data.lessonTitle}</strong>. Keep your momentum going!</p>
      <center><a class="button" href="${data.lessonUrl}">View Lesson</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  inactivity: (data: { name: string; days: number; resumeUrl: string; offerHtml?: string }): EmailTemplate => ({
    to: '',
    subject: data.days >= 30 ? 'We miss you — here’s something to help' : `It’s been ${data.days} days — pick up where you left off`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:${data.days>=30?'#F59E0B':'#64748B'};padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#3B82F6;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .offer{background:#FFFBEB;border-left:4px solid #F59E0B;padding:14px;border-radius:4px;margin-top:10px}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Welcome back, ${data.name}</h1></div>
      <div class="content"><p>It’s been ${data.days} days since your last visit. Resume your course and keep your CE hours on track.</p>
      ${data.offerHtml ? `<div class="offer">${data.offerHtml}</div>` : ''}
      <center><a class="button" href="${data.resumeUrl}">Resume Learning</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  abandonedCart: (data: { name: string; checkoutUrl: string; courseName?: string }): EmailTemplate => ({
    to: '',
    subject: data.courseName ? `Finish enrolling in ${data.courseName}` : 'Complete your enrollment',
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#E11D48;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#E11D48;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Complete your enrollment</h1></div>
      <div class="content"><p>Hi ${data.name}, you started checkout but didn’t finish. Pick up where you left off:</p>
      <center><a class="button" href="${data.checkoutUrl}">Return to Checkout</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  monthlySummary: (data: { name: string; ceHours: number; lessonsCompleted: number; summaryHtml: string; dashboardUrl: string }): EmailTemplate => ({
    to: '',
    subject: 'Your monthly learning summary',
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#0EA5E9;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .kpi{display:flex;gap:16px;margin:14px 0}
      .kpi > div{flex:1;background:#F1F5F9;border-radius:8px;padding:14px;text-align:center}
      .button{display:inline-block;background:#0EA5E9;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Monthly Progress</h1></div>
      <div class="content"><p>Hi ${data.name}, here’s what you accomplished this month:</p>
      <div class="kpi"><div><div style="font-size:28px;font-weight:700">${data.ceHours}</div><div>CE Hours</div></div><div><div style="font-size:28px;font-weight:700">${data.lessonsCompleted}</div><div>Lessons</div></div></div>
      ${data.summaryHtml}
      <center><a class="button" href="${data.dashboardUrl}">Open Dashboard</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  streakNotification: (data: { name: string; streakDays: number; dashboardUrl: string }): EmailTemplate => ({
    to: '',
    subject: `🔥 ${data.streakDays}-day learning streak!`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#F97316;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#F97316;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Keep the streak alive!</h1></div>
      <div class="content"><p>Awesome work, ${data.name}! You’re on a <strong>${data.streakDays}-day</strong> streak.</p>
      <center><a class="button" href="${data.dashboardUrl}">Continue Learning</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  paymentFailed: (data: { name: string; amount: number; retryUrl: string }): EmailTemplate => ({
    to: '',
    subject: `Payment failed — action required`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#DC2626;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#DC2626;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Payment Failed</h1></div>
      <div class="content"><p>Hi ${data.name}, your recent payment of $${data.amount.toFixed(2)} didn’t go through. Please update your payment method to continue.</p>
      <center><a class="button" href="${data.retryUrl}">Fix Payment</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  subscriptionRenewalReminder: (data: { name: string; renewDate: string; manageUrl: string }): EmailTemplate => ({
    to: '',
    subject: `Subscription renews on ${new Date(data.renewDate).toLocaleDateString()}`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#0EA5E9;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#0EA5E9;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Upcoming Renewal</h1></div>
      <div class="content"><p>Your subscription will renew on <strong>${new Date(data.renewDate).toLocaleDateString()}</strong>. Manage your plan anytime.</p>
      <center><a class="button" href="${data.manageUrl}">Manage Subscription</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  subscriptionRenewed: (data: { name: string; renewDate: string; invoiceUrl?: string }): EmailTemplate => ({
    to: '',
    subject: 'Subscription renewed successfully',
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#10B981;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#10B981;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Renewal Successful</h1></div>
      <div class="content"><p>Hi ${data.name}, your subscription renewed on ${new Date(data.renewDate).toLocaleDateString()}.</p>
      ${data.invoiceUrl ? `<center><a class="button" href="${data.invoiceUrl}">View Invoice</a></center>` : ''}
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  refundProcessed: (data: { name: string; amount: number; refundDate: string }): EmailTemplate => ({
    to: '',
    subject: `Refund processed: $${data.amount.toFixed(2)}`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#F59E0B;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Your refund is on the way</h1></div>
      <div class="content"><p>We processed your refund of <strong>$${data.amount.toFixed(2)}</strong> on ${new Date(data.refundDate).toLocaleDateString()}.
      Funds should appear on your statement within 5–10 business days.</p></div>
      <div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  paymentMethodExpiring: (data: { name: string; last4: string; expiry: string; manageUrl: string }): EmailTemplate => ({
    to: '',
    subject: 'Your payment method is expiring soon',
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#F43F5E;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#F43F5E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Update your card</h1></div>
      <div class="content"><p>Your card ending in <strong>${data.last4}</strong> expires on <strong>${data.expiry}</strong>. Please update your payment method to avoid interruptions.</p>
      <center><a class="button" href="${data.manageUrl}">Update Payment Method</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  securityAlert: (data: { name: string; event: string; ip?: string; location?: string; manageUrl: string }): EmailTemplate => ({
    to: '',
    subject: `Security alert: ${data.event}`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#111827;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#111827;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Account Security Notice</h1></div>
      <div class="content"><p>We detected: <strong>${data.event}</strong>.</p>
      ${data.ip || data.location ? `<p>Details: ${data.ip ? 'IP '+data.ip : ''} ${data.location ? '• '+data.location : ''}</p>` : ''}
      <center><a class="button" href="${data.manageUrl}">Review Account Activity</a></center>
      </div><div class="footer">If this wasn’t you, change your password and contact security@therabrake.academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  suspiciousActivity: (data: { name: string; description: string; manageUrl: string }): EmailTemplate => ({
    to: '',
    subject: 'Suspicious activity detected on your account',
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#7C3AED;padding:32px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:24px}
      .content{background:#fff;padding:30px 26px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#7C3AED;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;margin:16px 0}
      .footer{text-align:center;padding:18px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>We noticed something unusual</h1></div>
      <div class="content"><p>${data.description}</p>
      <center><a class="button" href="${data.manageUrl}">Secure My Account</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  maintenanceAnnouncement: (data: { window: string; statusUrl: string }): EmailTemplate => ({
    to: '',
    subject: 'Scheduled maintenance notice',
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#374151;padding:28px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:22px}
      .content{background:#fff;padding:26px 24px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#374151;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:600;margin:14px 0}
      .footer{text-align:center;padding:16px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Maintenance Window</h1></div>
      <div class="content"><p>The platform will be undergoing scheduled maintenance during: <strong>${data.window}</strong>.</p>
      <center><a class="button" href="${data.statusUrl}">View Status</a></center>
      </div><div class="footer">We’ll keep downtime minimal and appreciate your patience.</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  privacyPolicyUpdate: (data: { effectiveDate: string; policyUrl: string }): EmailTemplate => ({
    to: '',
    subject: 'We updated our Privacy Policy',
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#1F2937;padding:28px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:22px}
      .content{background:#fff;padding:26px 24px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#1F2937;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:600;margin:14px 0}
      .footer{text-align:center;padding:16px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>Privacy Policy Update</h1></div>
      <div class="content"><p>Our Privacy Policy has changed, effective ${new Date(data.effectiveDate).toLocaleDateString()}.</p>
      <center><a class="button" href="${data.policyUrl}">Read the Policy</a></center>
      </div><div class="footer">© ${new Date().getFullYear()} TheraBrake Academy</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),

  supportTicketConfirmation: (data: { ticketId: string; subject: string; viewUrl: string }): EmailTemplate => ({
    to: '',
    subject: `Support ticket received (#${data.ticketId})`,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:#0EA5E9;padding:28px 20px;text-align:center;border-radius:8px 8px 0 0}
      .header h1{color:#fff;margin:0;font-size:22px}
      .content{background:#fff;padding:26px 24px;border:1px solid #e5e7eb;border-top:none}
      .button{display:inline-block;background:#0EA5E9;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:600;margin:14px 0}
      .footer{text-align:center;padding:16px;color:#6b7280;font-size:14px}
      </style></head>
      <body><div class="container"><div class="header"><h1>We’re on it</h1></div>
      <div class="content"><p>We received your request: <strong>${data.subject}</strong>.</p>
      <p>Ticket ID: <strong>#${data.ticketId}</strong></p>
      <center><a class="button" href="${data.viewUrl}">View Ticket</a></center>
      </div><div class="footer">Our support team will reply shortly.</div></div></body></html>
    `,
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
  }),
};
