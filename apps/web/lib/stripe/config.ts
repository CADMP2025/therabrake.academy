import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
})

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  testMode: process.env.NODE_ENV !== 'production',
}

// All your Stripe Price IDs from .env.local
export const STRIPE_PRICES = {
  // CE Memberships
  CE_MEMBERSHIP_1Y: process.env.STRIPE_PRICE_CE_MEMBERSHIP_1Y!,
  CE_MEMBERSHIP_2Y: process.env.STRIPE_PRICE_CE_MEMBERSHIP_2Y!,
  CE_MEMBERSHIP_5Y: process.env.STRIPE_PRICE_CE_MEMBERSHIP_5Y!,
  
  // Personal Development Memberships
  PERSONAL_DEV_1Y: process.env.STRIPE_PRICE_PERSONAL_DEV_1Y!,
  PERSONAL_DEV_2Y: process.env.STRIPE_PRICE_PERSONAL_DEV_2Y!,
  PERSONAL_DEV_5Y: process.env.STRIPE_PRICE_PERSONAL_DEV_5Y!,
  
  // Premium Programs
  SOWHAT_MINDSET: process.env.STRIPE_PRICE_PREMIUM_SOWHAT_MINDSET!,
  SOWHAT_MINDSET_MEMBER: process.env.STRIPE_PRICE_PREMIUM_SOWHAT_MINDSET_MEMBER!,
  LEAP_LAUNCH: process.env.STRIPE_PRICE_PREMIUM_LEAP_LAUNCH!,
  LEAP_LAUNCH_MEMBER: process.env.STRIPE_PRICE_PREMIUM_LEAP_LAUNCH_MEMBER!,
}

export default stripe
