/**
 * GDPR/CCPA Compliance Functions
 * User data rights: Access, Deletion, Portability
 */

import { createClient } from '@/lib/supabase/client';

export interface UserDataExport {
  personalInfo: any;
  enrollments: any[];
  certificates: any[];
  payments: any[];
  progress: any[];
  exportedAt: Date;
  format: 'JSON' | 'CSV';
}

export class GDPRCompliance {
  private static supabase = createClient();

  /**
   * Export all user data (GDPR Right to Data Portability)
   */
  static async exportUserData(userId: string): Promise<UserDataExport> {
    const [profile, enrollments, certificates, payments, progress] = await Promise.all([
      this.supabase.from('profiles').select('*').eq('id', userId).single(),
      this.supabase.from('enrollments').select('*').eq('user_id', userId),
      this.supabase.from('certificates').select('*').eq('user_id', userId),
      this.supabase.from('payments').select('*').eq('user_id', userId),
      this.supabase.from('lesson_progress').select('*').eq('user_id', userId)
    ]);

    return {
      personalInfo: profile.data,
      enrollments: enrollments.data || [],
      certificates: certificates.data || [],
      payments: payments.data || [],
      progress: progress.data || [],
      exportedAt: new Date(),
      format: 'JSON'
    };
  }

  /**
   * Request account deletion (GDPR Right to Erasure)
   * Note: Some data must be retained for legal compliance (CE records)
   */
  static async requestDataDeletion(userId: string, verificationMethod: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('data_deletion_requests')
      .insert({
        user_id: userId,
        verification_method: verificationMethod,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return data.id;
  }

  /**
   * Process data deletion request
   * Keeps CE records as required by Texas LPC (4-year retention)
   */
  static async processDataDeletion(requestId: string): Promise<void> {
    // Get deletion request
    const { data: request } = await this.supabase
      .from('data_deletion_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!request) throw new Error('Deletion request not found');

    const userId = request.user_id;

    // Check what data must be retained
    const { data: certificates } = await this.supabase
      .from('certificates')
      .select('id, issued_date')
      .eq('user_id', userId);

    const retainedData: any = { certificates: [] };
    const fourYearsAgo = new Date();
    fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);

    // Retain CE certificates less than 4 years old (Texas LPC requirement)
    if (certificates) {
      retainedData.certificates = certificates
        .filter(cert => new Date(cert.issued_date) > fourYearsAgo)
        .map(cert => cert.id);
    }

    // Anonymize user profile instead of deleting
    await this.supabase
      .from('profiles')
      .update({
        email: `deleted_${userId}@deleted.therabrake.academy`,
        full_name: 'Deleted User',
        phone: null,
        bio: null,
        avatar_url: null,
        license_number: null // Anonymize but keep enrollment records
      })
      .eq('id', userId);

    // Delete non-required data
    await Promise.all([
      this.supabase.from('lesson_progress').delete().eq('user_id', userId),
      this.supabase.from('course_reviews').delete().eq('user_id', userId)
    ]);

    // Update deletion request
    await this.supabase
      .from('data_deletion_requests')
      .update({
        status: 'completed',
        completed_at: new Date(),
        retained_data: retainedData
      })
      .eq('id', requestId);

    // Send confirmation email to original address
    // await this.sendDeletionConfirmation(request.user_email);
  }

  /**
   * Get user consent records
   */
  static async getUserConsents(userId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', userId)
      .order('consented_at', { ascending: false });

    return data || [];
  }

  /**
   * Record user consent
   */
  static async recordConsent(
    userId: string,
    consentType: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.supabase.from('user_consents').insert({
      user_id: userId,
      consent_type: consentType,
      consented: true,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  /**
   * Withdraw consent
   */
  static async withdrawConsent(userId: string, consentType: string): Promise<void> {
    await this.supabase
      .from('user_consents')
      .update({
        consented: false,
        withdrawn_at: new Date()
      })
      .eq('user_id', userId)
      .eq('consent_type', consentType)
      .is('withdrawn_at', null);
  }
}
