import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@therabrake.academy';
export const FROM_NAME = process.env.RESEND_FROM_NAME || 'TheraBrake Academy';
