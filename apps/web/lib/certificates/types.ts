export type CertificateTemplate = 'texas_lpc'

export interface CertificateIssueInput {
  userId: string
  courseId: string
  enrollmentId: string
  courseTitle: string
  providerNumber?: string | null
  ceHours: number
  issuedAt?: Date
  expiresAt?: Date | null
  licenseNumber?: string | null
  licenseState?: string | null
  template?: CertificateTemplate
}

export interface CertificateIssueResult {
  certificateId: string
  certificateNumber: string
  verificationCode: string
  pdfUrl: string
}

export interface CertificateRenderData {
  certificateNumber: string
  verificationCode: string
  qrDataUrl: string
  courseTitle: string
  ceHours: number
  userFullName: string
  licenseNumber?: string | null
  licenseState?: string | null
  providerNumber?: string | null
  issuedAt: Date
  expiresAt?: Date | null
  signatureName: string
  signatureTitle: string
  signatureImageDataUrl?: string
  signingHash: string
}
