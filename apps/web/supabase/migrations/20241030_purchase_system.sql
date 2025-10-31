-- Purchase System Tables
-- Additional tables for promotional codes, gifts, and installment plans

-- Promotional Codes Table
CREATE TABLE IF NOT EXISTS promotional_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  active BOOLEAN DEFAULT true,
  applicable_to TEXT[] DEFAULT NULL, -- ['course', 'membership', 'program']
  minimum_purchase_amount INTEGER DEFAULT NULL,
  max_uses INTEGER DEFAULT NULL,
  times_used INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_promotional_codes_code ON promotional_codes(code);
CREATE INDEX idx_promotional_codes_active ON promotional_codes(active);
CREATE INDEX idx_promotional_codes_expires_at ON promotional_codes(expires_at);

COMMENT ON TABLE promotional_codes IS 'Promotional discount codes for purchases';
COMMENT ON COLUMN promotional_codes.discount_type IS 'Type of discount: percentage or fixed amount';
COMMENT ON COLUMN promotional_codes.discount_value IS 'Percentage (1-100) or fixed amount in cents';
COMMENT ON COLUMN promotional_codes.applicable_to IS 'Types of purchases this code applies to';

-- Gift Purchases Table
CREATE TABLE IF NOT EXISTS gift_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchaser_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  gift_type VARCHAR(50) NOT NULL CHECK (gift_type IN ('course', 'program', 'membership')),
  amount INTEGER NOT NULL,
  personal_message TEXT DEFAULT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delivered', 'redeemed', 'cancelled')),
  payment_intent_id VARCHAR(255) DEFAULT NULL,
  redemption_code VARCHAR(100) UNIQUE DEFAULT NULL,
  redeemed_by_user_id UUID DEFAULT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_gift_purchases_purchaser ON gift_purchases(purchaser_user_id);
CREATE INDEX idx_gift_purchases_recipient_email ON gift_purchases(recipient_email);
CREATE INDEX idx_gift_purchases_redemption_code ON gift_purchases(redemption_code);
CREATE INDEX idx_gift_purchases_status ON gift_purchases(status);
CREATE INDEX idx_gift_purchases_delivery_date ON gift_purchases(delivery_date);

COMMENT ON TABLE gift_purchases IS 'Gift course/program/membership purchases';
COMMENT ON COLUMN gift_purchases.redemption_code IS 'Unique code the recipient uses to redeem the gift';

-- Installment Plans Table
CREATE TABLE IF NOT EXISTS installment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_intent_id VARCHAR(255) NOT NULL,
  total_amount INTEGER NOT NULL,
  installment_amount INTEGER NOT NULL,
  total_installments INTEGER NOT NULL CHECK (total_installments BETWEEN 2 AND 12),
  current_installment INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'failed')),
  next_payment_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_installment_plans_user ON installment_plans(user_id);
CREATE INDEX idx_installment_plans_status ON installment_plans(status);
CREATE INDEX idx_installment_plans_next_payment ON installment_plans(next_payment_date);
CREATE INDEX idx_installment_plans_payment_intent ON installment_plans(payment_intent_id);

COMMENT ON TABLE installment_plans IS 'Payment installment plans for programs and courses';
COMMENT ON COLUMN installment_plans.next_payment_date IS 'Date when next installment payment is due';

-- Installment Payments Table (track individual installment payments)
CREATE TABLE IF NOT EXISTS installment_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES installment_plans(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  payment_intent_id VARCHAR(255) DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(plan_id, installment_number)
);

CREATE INDEX idx_installment_payments_plan ON installment_payments(plan_id);
CREATE INDEX idx_installment_payments_status ON installment_payments(status);
CREATE INDEX idx_installment_payments_due_date ON installment_payments(due_date);
CREATE INDEX idx_installment_payments_payment_intent ON installment_payments(payment_intent_id);

COMMENT ON TABLE installment_payments IS 'Individual installment payment records';

-- Row Level Security Policies

-- Promotional Codes (admin read/write, everyone can validate)
ALTER TABLE promotional_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY promotional_codes_select_policy ON promotional_codes
  FOR SELECT TO authenticated
  USING (active = true);

-- Gift Purchases (purchaser can see their gifts, recipient can see their received gifts)
ALTER TABLE gift_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY gift_purchases_purchaser_policy ON gift_purchases
  FOR ALL TO authenticated
  USING (purchaser_user_id = auth.uid());

CREATE POLICY gift_purchases_recipient_select_policy ON gift_purchases
  FOR SELECT TO authenticated
  USING (recipient_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Installment Plans (users can only see their own plans)
ALTER TABLE installment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY installment_plans_user_policy ON installment_plans
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Installment Payments (users can only see payments for their own plans)
ALTER TABLE installment_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY installment_payments_user_policy ON installment_payments
  FOR SELECT TO authenticated
  USING (
    plan_id IN (
      SELECT id FROM installment_plans WHERE user_id = auth.uid()
    )
  );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_promotional_codes_updated_at
  BEFORE UPDATE ON promotional_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gift_purchases_updated_at
  BEFORE UPDATE ON gift_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installment_plans_updated_at
  BEFORE UPDATE ON installment_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installment_payments_updated_at
  BEFORE UPDATE ON installment_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Helper Functions

-- Generate unique redemption code for gifts
CREATE OR REPLACE FUNCTION generate_gift_redemption_code()
RETURNS VARCHAR(100) AS $$
DECLARE
  code VARCHAR(100);
  done BOOLEAN := false;
BEGIN
  WHILE NOT done LOOP
    code := 'GIFT-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 12));
    IF NOT EXISTS (SELECT 1 FROM gift_purchases WHERE redemption_code = code) THEN
      done := true;
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Set redemption code on gift purchase creation
CREATE OR REPLACE FUNCTION set_gift_redemption_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.redemption_code IS NULL AND NEW.status = 'paid' THEN
    NEW.redemption_code := generate_gift_redemption_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gift_purchase_redemption_code
  BEFORE INSERT OR UPDATE ON gift_purchases
  FOR EACH ROW
  WHEN (NEW.redemption_code IS NULL AND NEW.status = 'paid')
  EXECUTE FUNCTION set_gift_redemption_code();

-- Calculate next installment due date
CREATE OR REPLACE FUNCTION calculate_next_installment_date(
  plan_id_param UUID
)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
  plan_record RECORD;
  last_payment RECORD;
  next_date TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT * INTO plan_record FROM installment_plans WHERE id = plan_id_param;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Get the last successful payment
  SELECT * INTO last_payment 
  FROM installment_payments 
  WHERE plan_id = plan_id_param AND status = 'succeeded'
  ORDER BY installment_number DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    -- First installment - due now
    RETURN NOW();
  ELSE
    -- Next installment due 30 days after last payment
    RETURN last_payment.paid_at + INTERVAL '30 days';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Get user's active installment plans
CREATE OR REPLACE FUNCTION get_user_active_installments(user_id_param UUID)
RETURNS TABLE (
  plan_id UUID,
  total_amount INTEGER,
  installment_amount INTEGER,
  total_installments INTEGER,
  current_installment INTEGER,
  next_payment_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    installment_plans.total_amount,
    installment_plans.installment_amount,
    installment_plans.total_installments,
    installment_plans.current_installment,
    installment_plans.next_payment_date,
    installment_plans.metadata
  FROM installment_plans
  WHERE user_id = user_id_param AND status = 'active'
  ORDER BY next_payment_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample promotional codes (for testing)
INSERT INTO promotional_codes (code, discount_type, discount_value, applicable_to, minimum_purchase_amount, max_uses)
VALUES 
  ('WELCOME10', 'percentage', 10, ARRAY['course', 'program'], 0, NULL),
  ('SAVE50', 'fixed', 5000, ARRAY['course', 'program'], 10000, 100),
  ('MEMBERSHIP20', 'percentage', 20, ARRAY['membership'], 0, 50)
ON CONFLICT (code) DO NOTHING;
