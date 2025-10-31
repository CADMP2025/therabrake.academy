/**
 * Enrollment Email Service
 * 
 * Handles all enrollment-related email notifications:
 * - Enrollment confirmation
 * - Expiration warnings (7, 3, 1 day)
 * - Access expired notification
 * - Extension confirmation
 */

import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/monitoring/logger'
import { resend } from '@/lib/email/resend-client'
import { BaseService, ServiceResponse } from './base-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@therabrake.academy'

export interface EnrollmentEmailData {
  userEmail: string
  userName: string
  courseName?: string
  programName?: string
  enrolledAt: string
  expiresAt?: string
  accessUrl: string
}

export interface ExpirationWarningData {
  userEmail: string
  userName: string
  courseName?: string
  programName?: string
  expiresAt: string
  daysRemaining: number
  extensionUrl: string
}

export interface AccessExpiredData {
  userEmail: string
  userName: string
  courseName?: string
  programName?: string
  expiredAt: string
  extensionUrl: string
}

export class EnrollmentEmailService extends BaseService {
  private static instance: EnrollmentEmailService

  private constructor() {
    super()
  }

  public static getInstance(): EnrollmentEmailService {
    if (!EnrollmentEmailService.instance) {
      EnrollmentEmailService.instance = new EnrollmentEmailService()
    }
    return EnrollmentEmailService.instance
  }

  /**
   * Send enrollment confirmation email
   */
  async sendEnrollmentConfirmation(
    data: EnrollmentEmailData
  ): Promise<ServiceResponse<boolean>> {
    try {
      const productName = data.courseName || data.programName || 'Course'
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to ${productName}!</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to TheraBrake Academy!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #667eea; margin-top: 0;">Enrollment Confirmed!</h2>
              
              <p>Hi ${data.userName},</p>
              
              <p>Congratulations! You're now enrolled in <strong>${productName}</strong>.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">Your Enrollment Details</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 8px 0;"><strong>Product:</strong> ${productName}</li>
                  <li style="padding: 8px 0;"><strong>Enrolled:</strong> ${new Date(data.enrolledAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</li>
                  ${data.expiresAt ? `
                    <li style="padding: 8px 0;"><strong>Access Until:</strong> ${new Date(data.expiresAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</li>
                  ` : '<li style="padding: 8px 0;"><strong>Access:</strong> Lifetime</li>'}
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.accessUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Start Learning Now</a>
              </div>
              
              <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #667eea;">What's Next?</h4>
                <ol style="margin: 0; padding-left: 20px;">
                  <li>Click the button above to access your course</li>
                  <li>Complete the modules at your own pace</li>
                  <li>Join our community for support and discussion</li>
                  <li>Track your progress in your dashboard</li>
                </ol>
              </div>
              
              <p style="margin-top: 30px;">If you have any questions, feel free to reach out to our support team.</p>
              
              <p>Happy learning!<br>The TheraBrake Academy Team</p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>© ${new Date().getFullYear()} TheraBrake Academy. All rights reserved.</p>
            </div>
          </body>
        </html>
      `

      await resend.emails.send({
        from: DEFAULT_FROM,
        to: data.userEmail,
        subject: `Welcome to ${productName}! 🎉`,
        html: emailHtml
      })

      logger.info('Enrollment confirmation email sent', {
        userEmail: data.userEmail,
        productName
      })

      return this.success(true)
    } catch (error: any) {
      logger.error('Error sending enrollment confirmation', error, {
        userEmail: data.userEmail
      })
      return this.error('Error sending enrollment confirmation', 'EMAIL_SEND_FAILED')
    }
  }

  /**
   * Send expiration warning email
   */
  async sendExpirationWarning(
    data: ExpirationWarningData
  ): Promise<ServiceResponse<boolean>> {
    try {
      const productName = data.courseName || data.programName || 'Course'
      const urgencyColor = data.daysRemaining <= 1 ? '#ef4444' : data.daysRemaining <= 3 ? '#f59e0b' : '#667eea'
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Your Access is Expiring Soon</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: ${urgencyColor}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">⏰ Access Expiring Soon</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: ${urgencyColor}; margin-top: 0;">Don't Lose Your Progress!</h2>
              
              <p>Hi ${data.userName},</p>
              
              <p>This is a friendly reminder that your access to <strong>${productName}</strong> will expire in:</p>
              
              <div style="background: white; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid ${urgencyColor};">
                <div style="font-size: 48px; font-weight: bold; color: ${urgencyColor}; margin-bottom: 10px;">
                  ${data.daysRemaining}
                </div>
                <div style="font-size: 20px; color: #666;">
                  ${data.daysRemaining === 1 ? 'Day' : 'Days'} Remaining
                </div>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0;"><strong>⚠️ Expiration Date:</strong> ${new Date(data.expiresAt).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              
              <p>To continue your learning journey and maintain access to all course materials, you can extend your enrollment:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.extensionUrl}" style="display: inline-block; background: ${urgencyColor}; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Extend My Access</a>
              </div>
              
              <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #667eea;">Why Extend?</h4>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Keep all your progress and notes</li>
                  <li>Continue accessing course materials</li>
                  <li>Stay connected with the community</li>
                  <li>Receive ongoing updates and resources</li>
                </ul>
              </div>
              
              <p style="margin-top: 30px;">Have questions? Our support team is here to help!</p>
              
              <p>Best regards,<br>The TheraBrake Academy Team</p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>© ${new Date().getFullYear()} TheraBrake Academy. All rights reserved.</p>
            </div>
          </body>
        </html>
      `

      await resend.emails.send({
        from: DEFAULT_FROM,
        to: data.userEmail,
        subject: `⏰ ${data.daysRemaining} ${data.daysRemaining === 1 ? 'Day' : 'Days'} Until Your Access Expires - ${productName}`,
        html: emailHtml
      })

      logger.info('Expiration warning email sent', {
        userEmail: data.userEmail,
        daysRemaining: data.daysRemaining,
        productName
      })

      return this.success(true)
    } catch (error: any) {
      logger.error('Error sending expiration warning', error, {
        userEmail: data.userEmail
      })
      return this.error('Error sending expiration warning', 'EMAIL_SEND_FAILED')
    }
  }

  /**
   * Send access expired notification
   */
  async sendAccessExpired(
    data: AccessExpiredData
  ): Promise<ServiceResponse<boolean>> {
    try {
      const productName = data.courseName || data.programName || 'Course'
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Your Access Has Expired</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #ef4444; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Access Expired</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #ef4444; margin-top: 0;">Your Access Has Ended</h2>
              
              <p>Hi ${data.userName},</p>
              
              <p>Your access to <strong>${productName}</strong> has expired as of ${new Date(data.expiredAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h3 style="margin-top: 0; color: #ef4444;">What This Means</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>You can no longer access course materials</li>
                  <li>Your progress has been saved</li>
                  <li>You can renew anytime to continue learning</li>
                </ul>
              </div>
              
              <p>Good news! You can restore your access and pick up right where you left off:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.extensionUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Renew My Access</a>
              </div>
              
              <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #667eea;">When You Renew:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>✓ All your progress will be restored</li>
                  <li>✓ Immediate access to all materials</li>
                  <li>✓ Rejoin the community</li>
                  <li>✓ Access to any new updates</li>
                </ul>
              </div>
              
              <p style="margin-top: 30px;">We'd love to see you back! If you have any questions about renewing, please reach out.</p>
              
              <p>Thank you for being part of TheraBrake Academy!<br>The Team</p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>© ${new Date().getFullYear()} TheraBrake Academy. All rights reserved.</p>
            </div>
          </body>
        </html>
      `

      await resend.emails.send({
        from: DEFAULT_FROM,
        to: data.userEmail,
        subject: `Your Access to ${productName} Has Expired`,
        html: emailHtml
      })

      logger.info('Access expired email sent', {
        userEmail: data.userEmail,
        productName
      })

      return this.success(true)
    } catch (error: any) {
      logger.error('Error sending access expired notification', error, {
        userEmail: data.userEmail
      })
      return this.error('Error sending access expired notification', 'EMAIL_SEND_FAILED')
    }
  }

  /**
   * Process and send scheduled expiration warnings
   */
  async processScheduledWarnings(): Promise<ServiceResponse<number>> {
    try {
      const now = new Date().toISOString()

      // Get pending notifications that are due
      const { data: notifications, error } = await supabase
        .from('scheduled_notifications')
        .select(`
          *,
          enrollments!inner(
            user_id,
            course_id,
            program_type,
            expires_at,
            users:user_id (
              email,
              raw_user_meta_data
            ),
            courses:course_id (
              title
            )
          )
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', now)
        .limit(50)

      if (error) {
        logger.error('Failed to get scheduled notifications', undefined, {
          message: error.message
        })
        return this.error('Failed to get scheduled notifications', 'FETCH_FAILED')
      }

      let processed = 0

      for (const notification of notifications || []) {
        const enrollment = (notification as any).enrollments
        const user = enrollment.users
        const course = enrollment.courses

        try {
          // Determine days remaining based on notification type
          let daysRemaining = 0
          if (notification.notification_type === '7_day_warning') daysRemaining = 7
          else if (notification.notification_type === '3_day_warning') daysRemaining = 3
          else if (notification.notification_type === '1_day_warning') daysRemaining = 1

          await this.sendExpirationWarning({
            userEmail: user.email,
            userName: user.raw_user_meta_data?.full_name || 'Student',
            courseName: course?.title,
            programName: enrollment.program_type,
            expiresAt: enrollment.expires_at,
            daysRemaining,
            extensionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/extend/${enrollment.id}`
          })

          // Mark as sent
          await supabase
            .from('scheduled_notifications')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', notification.id)

          processed++
        } catch (error: any) {
          logger.error('Error processing notification', error, {
            notificationId: notification.id
          })

          // Mark as failed
          await supabase
            .from('scheduled_notifications')
            .update({
              status: 'failed',
              error_message: error.message
            })
            .eq('id', notification.id)
        }
      }

      logger.info('Processed scheduled warnings', {
        processed
      })

      return this.success(processed)
    } catch (error: any) {
      logger.error('Error processing scheduled warnings', error)
      return this.error('Error processing scheduled warnings', 'PROCESS_ERROR')
    }
  }
}
