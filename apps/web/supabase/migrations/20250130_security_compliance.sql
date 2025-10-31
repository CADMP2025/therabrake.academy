-- Security and Compliance Tables
-- Audit Logging, Security Events, and Compliance Tracking

-- =====================================================
-- AUDIT LOGS TABLE (7-year retention)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role TEXT,
  actor_ip INET,
  actor_user_agent TEXT,
  target_id UUID,
  target_type TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  changes JSONB,
  metadata JSONB,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  request_id TEXT,
  session_id TEXT,
  country_code TEXT,
  anonymized_actor_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  retention_until TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 years'
);

-- Indexes for audit logs
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_target_id ON audit_logs(target_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX idx_audit_logs_actor_ip ON audit_logs(actor_ip);
CREATE INDEX idx_audit_logs_anonymized ON audit_logs(anonymized_actor_id);

-- Composite indexes for common queries
CREATE INDEX idx_audit_logs_actor_date ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_target_date ON audit_logs(target_id, created_at DESC);
CREATE INDEX idx_audit_logs_type_date ON audit_logs(event_type, created_at DESC);

-- =====================================================
-- SECURITY EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_details JSONB,
  ip_address INET,
  user_agent TEXT,
  geo_location JSONB,
  risk_score INTEGER DEFAULT 0,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_created ON security_events(created_at DESC);
CREATE INDEX idx_security_events_risk ON security_events(risk_score DESC);
CREATE INDEX idx_security_events_blocked ON security_events(is_blocked);

-- =====================================================
-- FAILED LOGIN ATTEMPTS (Rate limiting and monitoring)
-- =====================================================
CREATE TABLE IF NOT EXISTS failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  failure_reason TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  country_code TEXT
);

CREATE INDEX idx_failed_logins_email ON failed_login_attempts(email, attempted_at DESC);
CREATE INDEX idx_failed_logins_ip ON failed_login_attempts(ip_address, attempted_at DESC);
CREATE INDEX idx_failed_logins_attempted ON failed_login_attempts(attempted_at DESC);

-- =====================================================
-- MFA VERIFICATION LOG
-- =====================================================
CREATE TABLE IF NOT EXISTS mfa_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('totp', 'sms', 'email', 'recovery')),
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mfa_verifications_user ON mfa_verifications(user_id, verified_at DESC);
CREATE INDEX idx_mfa_verifications_success ON mfa_verifications(success);

-- =====================================================
-- DATA RETENTION POLICY
-- =====================================================
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_type TEXT NOT NULL UNIQUE,
  retention_period_days INTEGER NOT NULL,
  purge_method TEXT NOT NULL CHECK (purge_method IN ('delete', 'anonymize', 'archive')),
  last_purge_at TIMESTAMP WITH TIME ZONE,
  next_purge_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default retention policies (4-year minimum for educational records)
INSERT INTO data_retention_policies (data_type, retention_period_days, purge_method, next_purge_at) VALUES
  ('educational_records', 1460, 'archive', NOW() + INTERVAL '1460 days'), -- 4 years (FERPA)
  ('audit_logs', 2555, 'archive', NOW() + INTERVAL '2555 days'), -- 7 years
  ('payment_records', 2555, 'archive', NOW() + INTERVAL '2555 days'), -- 7 years (PCI DSS)
  ('certificates', 3650, 'archive', NOW() + INTERVAL '3650 days'), -- 10 years (professional requirement)
  ('user_activity', 730, 'anonymize', NOW() + INTERVAL '730 days'), -- 2 years
  ('marketing_data', 1095, 'delete', NOW() + INTERVAL '1095 days') -- 3 years
ON CONFLICT (data_type) DO NOTHING;

-- =====================================================
-- COMPLIANCE REQUESTS (GDPR, FERPA)
-- =====================================================
CREATE TABLE IF NOT EXISTS compliance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('gdpr_export', 'gdpr_deletion', 'ferpa_access', 'ferpa_amendment')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  requested_by UUID REFERENCES auth.users(id),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  response_data JSONB,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  compliance_officer_notes TEXT
);

CREATE INDEX idx_compliance_requests_user ON compliance_requests(user_id);
CREATE INDEX idx_compliance_requests_status ON compliance_requests(status);
CREATE INDEX idx_compliance_requests_type ON compliance_requests(request_type);
CREATE INDEX idx_compliance_requests_requested ON compliance_requests(requested_at DESC);

-- =====================================================
-- FILE UPLOAD SECURITY
-- =====================================================
CREATE TABLE IF NOT EXISTS secure_file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  virus_scan_status TEXT DEFAULT 'pending' CHECK (virus_scan_status IN ('pending', 'clean', 'infected', 'error')),
  virus_scan_result JSONB,
  file_hash TEXT NOT NULL,
  is_encrypted BOOLEAN DEFAULT false,
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'instructor', 'admin', 'public')),
  expiry_url TEXT,
  expiry_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0
);

CREATE INDEX idx_secure_files_user ON secure_file_uploads(user_id);
CREATE INDEX idx_secure_files_scan ON secure_file_uploads(virus_scan_status);
CREATE INDEX idx_secure_files_expiry ON secure_file_uploads(expiry_at);
CREATE INDEX idx_secure_files_hash ON secure_file_uploads(file_hash);

-- =====================================================
-- ENCRYPTED DATA KEYS (Key rotation tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS encryption_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_version INTEGER NOT NULL,
  key_algorithm TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rotated_at TIMESTAMP WITH TIME ZONE,
  next_rotation_at TIMESTAMP WITH TIME ZONE,
  rotation_status TEXT DEFAULT 'active' CHECK (rotation_status IN ('active', 'rotating', 'retired'))
);

CREATE INDEX idx_encryption_keys_active ON encryption_keys(is_active);
CREATE INDEX idx_encryption_keys_version ON encryption_keys(key_version DESC);

-- =====================================================
-- IP WHITELIST/BLACKLIST
-- =====================================================
CREATE TABLE IF NOT EXISTS ip_restrictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address INET NOT NULL,
  ip_range CIDR,
  restriction_type TEXT NOT NULL CHECK (restriction_type IN ('whitelist', 'blacklist', 'rate_limit')),
  reason TEXT,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_ip_restrictions_address ON ip_restrictions(ip_address);
CREATE INDEX idx_ip_restrictions_type ON ip_restrictions(restriction_type);
CREATE INDEX idx_ip_restrictions_active ON ip_restrictions(is_active);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Audit logs: Only admins can read
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_admin_read ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY audit_logs_system_insert ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow system to insert, validate in app layer

-- Security events: Admins and users can see their own
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY security_events_own_read ON security_events
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Compliance requests: Users can read their own, admins can read all
ALTER TABLE compliance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY compliance_requests_own_read ON compliance_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    requested_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'compliance_officer')
    )
  );

CREATE POLICY compliance_requests_user_insert ON compliance_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR requested_by = auth.uid());

-- Secure file uploads: Users can read their own, instructors/admins can read based on access level
ALTER TABLE secure_file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY secure_files_own_read ON secure_file_uploads
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    access_level = 'public' OR
    (access_level = 'instructor' AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('instructor', 'admin')
    )) OR
    (access_level = 'admin' AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    ))
  );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Auto-delete expired audit logs
CREATE OR REPLACE FUNCTION delete_expired_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_logs
  WHERE retention_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule daily cleanup (run via cron job)
-- SELECT cron.schedule('cleanup-audit-logs', '0 2 * * *', 'SELECT delete_expired_audit_logs()');

-- Auto-update secure file last accessed time
CREATE OR REPLACE FUNCTION update_file_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed_at := NOW();
  NEW.access_count := OLD.access_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_file_access
  BEFORE UPDATE OF access_count ON secure_file_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_file_last_accessed();

-- Anonymize user data after retention period
CREATE OR REPLACE FUNCTION anonymize_expired_user_data()
RETURNS void AS $$
BEGIN
  -- Anonymize user activity logs older than retention period
  UPDATE audit_logs
  SET 
    actor_ip = NULL,
    actor_user_agent = NULL,
    metadata = metadata - 'email' - 'phone' - 'address'
  WHERE created_at < NOW() - (
    SELECT retention_period_days * INTERVAL '1 day'
    FROM data_retention_policies
    WHERE data_type = 'user_activity'
  );
END;
$$ LANGUAGE plpgsql;

-- Detect suspicious activity patterns
CREATE OR REPLACE FUNCTION detect_suspicious_activity(p_user_id UUID)
RETURNS TABLE (
  is_suspicious BOOLEAN,
  risk_score INTEGER,
  reasons TEXT[]
) AS $$
DECLARE
  v_failed_logins INTEGER;
  v_unique_ips INTEGER;
  v_unique_countries INTEGER;
  v_reasons TEXT[] := ARRAY[]::TEXT[];
  v_risk INTEGER := 0;
BEGIN
  -- Count failed logins in last 24 hours
  SELECT COUNT(*) INTO v_failed_logins
  FROM failed_login_attempts
  WHERE email = (SELECT email FROM auth.users WHERE id = p_user_id)
  AND attempted_at > NOW() - INTERVAL '24 hours';
  
  IF v_failed_logins > 5 THEN
    v_reasons := array_append(v_reasons, format('%s failed login attempts', v_failed_logins));
    v_risk := v_risk + 30;
  END IF;
  
  -- Check unique IPs
  SELECT COUNT(DISTINCT actor_ip) INTO v_unique_ips
  FROM audit_logs
  WHERE actor_id = p_user_id
  AND created_at > NOW() - INTERVAL '24 hours';
  
  IF v_unique_ips > 3 THEN
    v_reasons := array_append(v_reasons, format('Activity from %s different IPs', v_unique_ips));
    v_risk := v_risk + 20;
  END IF;
  
  -- Check unique countries
  SELECT COUNT(DISTINCT country_code) INTO v_unique_countries
  FROM audit_logs
  WHERE actor_id = p_user_id
  AND created_at > NOW() - INTERVAL '24 hours'
  AND country_code IS NOT NULL;
  
  IF v_unique_countries > 2 THEN
    v_reasons := array_append(v_reasons, format('Activity from %s different countries', v_unique_countries));
    v_risk := v_risk + 40;
  END IF;
  
  RETURN QUERY SELECT
    v_risk > 50,
    LEAST(v_risk, 100),
    v_reasons;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT ON audit_logs TO authenticated;
GRANT SELECT, INSERT ON security_events TO authenticated;
GRANT SELECT, INSERT ON failed_login_attempts TO authenticated;
GRANT SELECT, INSERT ON mfa_verifications TO authenticated;
GRANT SELECT ON data_retention_policies TO authenticated;
GRANT SELECT, INSERT, UPDATE ON compliance_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON secure_file_uploads TO authenticated;

-- Comments for documentation
COMMENT ON TABLE audit_logs IS '7-year retention audit log for all security and compliance events';
COMMENT ON TABLE security_events IS 'Real-time security event tracking and anomaly detection';
COMMENT ON TABLE failed_login_attempts IS 'Failed login tracking for rate limiting and security monitoring';
COMMENT ON TABLE data_retention_policies IS 'Automated data retention and purge policies (FERPA, GDPR, PCI DSS)';
COMMENT ON TABLE compliance_requests IS 'GDPR and FERPA compliance request tracking';
COMMENT ON TABLE secure_file_uploads IS 'Secure file upload tracking with virus scanning and expiring URLs';
