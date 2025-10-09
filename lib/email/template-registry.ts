import WelcomeEmail from './templates/welcome-email';
import PasswordResetEmail from './templates/password-reset-email';
import EnrollmentConfirmation from './templates/enrollment-confirmation';
import InstructorNewEnrollment from './templates/instructor-new-enrollment';
import CertificateCompletion from './templates/certificate-completion';

export const emailTemplates = {
  'welcome': WelcomeEmail,
  'password-reset': PasswordResetEmail,
  'enrollment-confirmation': EnrollmentConfirmation,
  'instructor-new-enrollment': InstructorNewEnrollment,
  'certificate-completion': CertificateCompletion,
} as const;

export type EmailTemplate = keyof typeof emailTemplates;
