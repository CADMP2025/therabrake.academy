-- =====================================================
-- COMPREHENSIVE AUDIT LOGGING SYSTEM
-- Required for Texas LPC & FERPA Compliance
-- =====================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main audit logs table (partitioned by month for performance)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL CHECK (event_category IN ('data', 'authentication', 'authorization', 'compliance', 'payment', 'certificate')),
  
  -- Table/Entity information
  table_name TEXT NOT NULL,
  record_id UUID,
  record_identifier TEXT,
  
  -- Change tracking
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  
  -- User context
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_role TEXT,
  user_ip INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Request context
  request_id UUID,
  request_method TEXT,
  request_path TEXT,
  
  -- Compliance & Security
  compliance_flags TEXT[], -- ['FERPA', 'TEXAS_LPC', 'PCI']
  security_level TEXT DEFAULT 'standard' CHECK (security_level IN ('standard', 'elevated', 'critical')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for next 12 months
DO $$
DECLARE
  start_date DATE;
  end_date DATE;
  partition_name TEXT;
BEGIN
  FOR i IN 0..11 LOOP
    start_date := DATE_TRUNC('month', CURRENT_DATE + (i || ' months')::INTERVAL);
    end_date := start_date + INTERVAL '1 month';
    partition_name := 'audit_logs_' || TO_CHAR(start_date, 'YYYY_MM');
    
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs FOR VALUES FROM (%L) TO (%L)',
      partition_name, start_date, end_date
    );
  END LOOP;
END $$;

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_user_time ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_logs(table_name, record_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_compliance ON audit_logs USING GIN(compliance_flags);
CREATE INDEX IF NOT EXISTS idx_audit_security ON audit_logs(security_level) WHERE security_level != 'standard';

-- Texas LPC specific CE audit logs
CREATE TABLE IF NOT EXISTS ce_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_log_id UUID,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  course_id UUID,
  certificate_id UUID,
  license_number TEXT NOT NULL,
  license_state TEXT DEFAULT 'TX',
  ce_hours_earned DECIMAL(4,2),
  ce_category TEXT,
  verification_method TEXT,
  verification_timestamp TIMESTAMPTZ,
  reported_to_state BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ce_audit_user ON ce_audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ce_audit_license ON ce_audit_logs(license_number, license_state);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
  audit_user_id UUID;
  compliance_flags TEXT[];
BEGIN
  -- Get user context
  audit_user_id := auth.uid();
  
  -- Determine compliance flags based on table
  compliance_flags := CASE
    WHEN TG_TABLE_NAME IN ('certificates', 'ce_audit_logs') THEN ARRAY['CE_RECORD', 'TEXAS_LPC']
    WHEN TG_TABLE_NAME IN ('profiles', 'enrollments') THEN ARRAY['FERPA']
    WHEN TG_TABLE_NAME IN ('payments') THEN ARRAY['PCI']
    ELSE ARRAY[]::TEXT[]
  END;
  
  -- Insert audit record
  INSERT INTO audit_logs (
    event_type,
    event_category,
    table_name,
    record_id,
    operation,
    old_data,
    new_data,
    changed_fields,
    user_id,
    compliance_flags,
    security_level
  ) VALUES (
    LOWER(TG_OP),
    CASE 
      WHEN TG_TABLE_NAME IN ('payments') THEN 'payment'
      WHEN TG_TABLE_NAME IN ('certificates') THEN 'certificate'
      ELSE 'data'
    END,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    CASE 
      WHEN TG_OP = 'UPDATE' THEN 
        ARRAY(SELECT jsonb_object_keys(to_jsonb(NEW)) EXCEPT SELECT jsonb_object_keys(to_jsonb(OLD)))
      ELSE NULL 
    END,
    audit_user_id,
    compliance_flags,
    CASE 
      WHEN TG_TABLE_NAME IN ('payments', 'certificates') THEN 'critical'
      WHEN TG_TABLE_NAME IN ('profiles', 'enrollments') THEN 'elevated'
      ELSE 'standard'
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to all critical tables
DROP TRIGGER IF EXISTS audit_profiles ON profiles;
CREATE TRIGGER audit_profiles AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF NOT EXISTS audit_courses ON courses;
CREATE TRIGGER audit_courses AFTER INSERT OR UPDATE OR DELETE ON courses
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF NOT EXISTS audit_enrollments ON enrollments;
CREATE TRIGGER audit_enrollments AFTER INSERT OR UPDATE OR DELETE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF NOT EXISTS audit_payments ON payments;
CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF NOT EXISTS audit_certificates ON certificates;
CREATE TRIGGER audit_certificates AFTER INSERT OR UPDATE OR DELETE ON certificates
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Authentication event logging function
CREATE OR REPLACE FUNCTION log_auth_event(
  p_event_type TEXT,
  p_user_id UUID,
  p_user_email TEXT,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_success BOOLEAN
) RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO audit_logs (
    event_type,
    event_category,
    table_name,
    user_id,
    user_email,
    user_ip,
    user_agent,
    new_data,
    compliance_flags,
    security_level
  ) VALUES (
    p_event_type,
    'authentication',
    'auth_events',
    p_user_id,
    p_user_email,
    p_ip_address::INET,
    p_user_agent,
    jsonb_build_object('success', p_success, 'timestamp', NOW()),
    ARRAY['FERPA'],
    CASE WHEN NOT p_success THEN 'elevated' ELSE 'standard' END
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Payment audit logging
CREATE OR REPLACE FUNCTION log_payment_event(
  p_payment_id UUID,
  p_user_id UUID,
  p_amount DECIMAL,
  p_status TEXT,
  p_stripe_intent_id TEXT
) RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO audit_logs (
    event_type,
    event_category,
    table_name,
    record_id,
    user_id,
    new_data,
    compliance_flags,
    security_level
  ) VALUES (
    'payment_' || p_status,
    'payment',
    'payments',
    p_payment_id,
    p_user_id,
    jsonb_build_object(
      'amount', p_amount,
      'status', p_status,
      'stripe_intent_id', p_stripe_intent_id,
      'timestamp', NOW()
    ),
    ARRAY['PCI'],
    'critical'
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE audit_logs IS 'Comprehensive audit log for all system activities - 7 year retention required';
COMMENT ON TABLE ce_audit_logs IS 'Texas LPC specific CE credit audit trail - 4 year retention required';
