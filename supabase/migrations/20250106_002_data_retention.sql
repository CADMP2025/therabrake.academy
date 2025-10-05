-- =====================================================
-- DATA RETENTION & COMPLIANCE SYSTEM
-- =====================================================

-- Retention policies configuration
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_name TEXT UNIQUE NOT NULL,
  table_name TEXT NOT NULL,
  data_category TEXT NOT NULL,
  retention_period_years INTEGER NOT NULL,
  compliance_framework TEXT[] NOT NULL, -- ['FERPA', 'TEXAS_LPC', 'PCI']
  action_on_expire TEXT NOT NULL CHECK (action_on_expire IN ('archive', 'delete', 'anonymize')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_executed TIMESTAMPTZ
);

-- Archive storage for compliance
CREATE TABLE IF NOT EXISTS archived_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_table TEXT NOT NULL,
  source_record_id UUID NOT NULL,
  data JSONB NOT NULL,
  compliance_tags TEXT[],
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at DATE,
  can_delete_after DATE,
  UNIQUE(source_table, source_record_id)
);

-- Insert default retention policies
INSERT INTO data_retention_policies (
  policy_name,
  table_name,
  data_category,
  retention_period_years,
  compliance_framework,
  action_on_expire
) VALUES 
-- Texas LPC CE Records (4-year requirement)
(
  'texas_lpc_ce_records',
  'certificates',
  'ce_certificates',
  4,
  ARRAY['TEXAS_LPC'],
  'archive'
),
-- FERPA Educational Records (5 years after last attendance)
(
  'ferpa_educational_records',
  'enrollments',
  'educational_records',
  5,
  ARRAY['FERPA'],
  'archive'
),
-- Payment Records (7 years for tax/legal)
(
  'payment_records',
  'payments',
  'payment_data',
  7,
  ARRAY['PCI'],
  'archive'
),
-- Audit Logs (7 years for compliance)
(
  'audit_log_retention',
  'audit_logs',
  'compliance_data',
  7,
  ARRAY['SOC2', 'FERPA'],
  'archive'
),
-- User profiles (anonymize after account deletion request)
(
  'user_profile_retention',
  'profiles',
  'personal_data',
  2,
  ARRAY['GDPR', 'CCPA'],
  'anonymize'
)
ON CONFLICT (policy_name) DO NOTHING;

-- Function to archive expired records
CREATE OR REPLACE FUNCTION archive_expired_records(p_table_name TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_policy data_retention_policies;
  v_count INTEGER := 0;
  v_cutoff_date DATE;
BEGIN
  -- Get retention policy
  SELECT * INTO v_policy 
  FROM data_retention_policies 
  WHERE table_name = p_table_name AND is_active = TRUE;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'No active retention policy for table: %', p_table_name;
    RETURN 0;
  END IF;
  
  -- Calculate cutoff date
  v_cutoff_date := CURRENT_DATE - (v_policy.retention_period_years || ' years')::INTERVAL;
  
  -- Archive records based on table
  IF p_table_name = 'certificates' THEN
    INSERT INTO archived_data (source_table, source_record_id, data, compliance_tags, expires_at)
    SELECT 
      'certificates',
      id,
      to_jsonb(certificates.*),
      ARRAY['TEXAS_LPC', 'CE_RECORD'],
      CURRENT_DATE + INTERVAL '4 years'
    FROM certificates
    WHERE issued_date < v_cutoff_date
    ON CONFLICT (source_table, source_record_id) DO NOTHING;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
  END IF;
  
  -- Update last execution
  UPDATE data_retention_policies
  SET last_executed = NOW()
  WHERE id = v_policy.id;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Scheduled job to run retention policies (execute monthly)
CREATE OR REPLACE FUNCTION execute_retention_policies()
RETURNS TABLE(table_name TEXT, records_archived INTEGER) AS $$
DECLARE
  v_policy RECORD;
BEGIN
  FOR v_policy IN 
    SELECT DISTINCT table_name 
    FROM data_retention_policies 
    WHERE is_active = TRUE
  LOOP
    RETURN QUERY SELECT 
      v_policy.table_name, 
      archive_expired_records(v_policy.table_name);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE data_retention_policies IS 'Defines data retention requirements for compliance';
COMMENT ON TABLE archived_data IS 'Stores archived records meeting retention requirements';
