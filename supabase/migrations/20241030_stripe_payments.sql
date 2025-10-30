-- Stripe Payment System Tables
-- Migration: 20241030_stripe_payments.sql
-- Purpose: Complete payment, subscription, and refund tracking

-- =============================================
-- PAYMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe IDs
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_charge_id TEXT,
  
  -- Payment Details
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded')),
  
  -- Product Information
  product_type TEXT NOT NULL CHECK (product_type IN ('course', 'membership', 'program', 'extension')),
  product_id TEXT NOT NULL, -- course_id, membership_id, etc.
  product_name TEXT NOT NULL,
  
  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Payment Method
  payment_method_type TEXT, -- card, bank_account, etc.
  last4 TEXT,
  card_brand TEXT,
  
  -- Status Tracking
  payment_method_id TEXT,
  receipt_url TEXT,
  receipt_email TEXT,
  
  -- Failure Information
  failure_code TEXT,
  failure_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_payments_user_id (user_id),
  INDEX idx_payments_stripe_payment_intent (stripe_payment_intent_id),
  INDEX idx_payments_stripe_customer (stripe_customer_id),
  INDEX idx_payments_status (status),
  INDEX idx_payments_product (product_type, product_id)
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payments"
  ON public.payments FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe IDs
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  stripe_product_id TEXT NOT NULL,
  
  -- Subscription Details
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'paused')),
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('monthly', 'annual', 'lifetime')),
  
  -- Product Information
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL, -- membership, program, etc.
  
  -- Billing
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  billing_cycle_anchor TIMESTAMPTZ,
  
  -- Periods
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_subscriptions_user_id (user_id),
  INDEX idx_subscriptions_stripe_id (stripe_subscription_id),
  INDEX idx_subscriptions_status (status),
  INDEX idx_subscriptions_period_end (current_period_end)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- REFUNDS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe IDs
  stripe_refund_id TEXT UNIQUE NOT NULL,
  stripe_charge_id TEXT NOT NULL,
  
  -- Refund Details
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  reason TEXT CHECK (reason IN ('duplicate', 'fraudulent', 'requested_by_customer', 'other')),
  
  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  refunded_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_refunds_payment_id (payment_id),
  INDEX idx_refunds_user_id (user_id),
  INDEX idx_refunds_stripe_refund (stripe_refund_id),
  INDEX idx_refunds_status (status)
);

-- Enable RLS
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own refunds"
  ON public.refunds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all refunds"
  ON public.refunds FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- PAYMENT ATTEMPTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.payment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Attempt Details
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed')),
  
  -- Retry Information
  retry_scheduled_at TIMESTAMPTZ,
  retry_attempted_at TIMESTAMPTZ,
  max_retry_attempts INTEGER DEFAULT 3,
  
  -- Failure Information
  error_code TEXT,
  error_message TEXT,
  error_type TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_payment_attempts_payment_id (payment_id),
  INDEX idx_payment_attempts_user_id (user_id),
  INDEX idx_payment_attempts_status (status),
  INDEX idx_payment_attempts_retry_scheduled (retry_scheduled_at)
);

-- Enable RLS
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own payment attempts"
  ON public.payment_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payment attempts"
  ON public.payment_attempts FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- DISPUTES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe IDs
  stripe_dispute_id TEXT UNIQUE NOT NULL,
  stripe_charge_id TEXT NOT NULL,
  
  -- Dispute Details
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('warning_needs_response', 'warning_under_review', 'warning_closed', 'needs_response', 'under_review', 'charge_refunded', 'won', 'lost')),
  reason TEXT NOT NULL,
  
  -- Evidence
  evidence_details JSONB DEFAULT '{}',
  evidence_submitted BOOLEAN DEFAULT FALSE,
  evidence_due_by TIMESTAMPTZ,
  
  -- Response
  response_text TEXT,
  responded_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_disputes_payment_id (payment_id),
  INDEX idx_disputes_user_id (user_id),
  INDEX idx_disputes_stripe_dispute (stripe_dispute_id),
  INDEX idx_disputes_status (status),
  INDEX idx_disputes_evidence_due (evidence_due_by)
);

-- Enable RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role can manage all disputes"
  ON public.disputes FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- STRIPE CUSTOMERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe ID
  stripe_customer_id TEXT UNIQUE NOT NULL,
  
  -- Customer Details
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  
  -- Default Payment Method
  default_payment_method_id TEXT,
  default_payment_method_type TEXT,
  default_payment_method_last4 TEXT,
  default_payment_method_brand TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_stripe_customers_user_id (user_id),
  INDEX idx_stripe_customers_stripe_id (stripe_customer_id)
);

-- Enable RLS
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own stripe customer"
  ON public.stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all stripe customers"
  ON public.stripe_customers FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- WEBHOOK EVENTS TABLE (for idempotency)
-- =============================================
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Stripe Event
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  
  -- Processing Status
  processed BOOLEAN DEFAULT FALSE,
  processing_attempts INTEGER DEFAULT 0,
  last_processing_error TEXT,
  
  -- Event Data
  event_data JSONB NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_webhook_events_stripe_id (stripe_event_id),
  INDEX idx_webhook_events_type (event_type),
  INDEX idx_webhook_events_processed (processed),
  INDEX idx_webhook_events_created (created_at)
);

-- Enable RLS
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Service role can manage webhook events"
  ON public.stripe_webhook_events FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- UPDATE TRIGGERS
-- =============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refunds_updated_at BEFORE UPDATE ON public.refunds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_attempts_updated_at BEFORE UPDATE ON public.payment_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_customers_updated_at BEFORE UPDATE ON public.stripe_customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Get active subscription for user
CREATE OR REPLACE FUNCTION get_active_subscription(p_user_id UUID)
RETURNS TABLE (
  subscription_id UUID,
  stripe_subscription_id TEXT,
  product_name TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.stripe_subscription_id,
    s.product_name,
    s.status,
    s.current_period_end
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trialing')
  ORDER BY s.current_period_end DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get payment history for user
CREATE OR REPLACE FUNCTION get_payment_history(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  payment_id UUID,
  amount INTEGER,
  currency TEXT,
  status TEXT,
  product_name TEXT,
  created_at TIMESTAMPTZ,
  receipt_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.amount,
    p.currency,
    p.status,
    p.product_name,
    p.created_at,
    p.receipt_url
  FROM public.payments p
  WHERE p.user_id = p_user_id
  ORDER BY p.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if payment requires retry
CREATE OR REPLACE FUNCTION should_retry_payment(p_payment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_attempt_count INTEGER;
  v_max_attempts INTEGER;
  v_payment_status TEXT;
BEGIN
  SELECT 
    COUNT(*),
    MAX(pa.max_retry_attempts),
    p.status
  INTO v_attempt_count, v_max_attempts, v_payment_status
  FROM public.payment_attempts pa
  JOIN public.payments p ON p.id = pa.payment_id
  WHERE pa.payment_id = p_payment_id
  GROUP BY p.status;
  
  RETURN (
    v_payment_status = 'failed' AND
    v_attempt_count < COALESCE(v_max_attempts, 3)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_active_subscription TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_history TO authenticated;
GRANT EXECUTE ON FUNCTION should_retry_payment TO service_role;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE public.payments IS 'Tracks all payment transactions via Stripe';
COMMENT ON TABLE public.subscriptions IS 'Tracks recurring subscriptions';
COMMENT ON TABLE public.refunds IS 'Tracks refund transactions';
COMMENT ON TABLE public.payment_attempts IS 'Tracks payment retry attempts';
COMMENT ON TABLE public.disputes IS 'Tracks payment disputes and chargebacks';
COMMENT ON TABLE public.stripe_customers IS 'Maps users to Stripe customers';
COMMENT ON TABLE public.stripe_webhook_events IS 'Tracks Stripe webhook events for idempotency';
