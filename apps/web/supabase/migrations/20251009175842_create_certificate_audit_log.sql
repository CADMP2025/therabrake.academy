-- Create certificate audit log table for compliance
CREATE TABLE IF NOT EXISTS certificate_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('generated', 'email_sent', 'downloaded', 'verified', 'revoked')),
  email_address TEXT,
  ip_address INET,
  user_agent TEXT,
  verification_code TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_certificate_audit_certificate_id ON certificate_audit_log(certificate_id);
CREATE INDEX idx_certificate_audit_user_id ON certificate_audit_log(user_id);
CREATE INDEX idx_certificate_audit_course_id ON certificate_audit_log(course_id);
CREATE INDEX idx_certificate_audit_action ON certificate_audit_log(action);
CREATE INDEX idx_certificate_audit_created_at ON certificate_audit_log(created_at);
CREATE INDEX idx_certificate_audit_verification_code ON certificate_audit_log(verification_code);

-- Add comment
COMMENT ON TABLE certificate_audit_log IS 'Immutable audit trail for certificate actions - retained for 7 years for Texas LPC compliance';

-- Enable RLS
ALTER TABLE certificate_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can view all audit logs
CREATE POLICY "Admins can view all certificate audit logs"
  ON certificate_audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users can view their own certificate audit logs
CREATE POLICY "Users can view own certificate audit logs"
  ON certificate_audit_log
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only service role can insert audit logs (via webhooks/server functions)
CREATE POLICY "Service role can insert audit logs"
  ON certificate_audit_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- No updates or deletes allowed (immutable audit trail)
-- Only service role can perform maintenance operations
CREATE POLICY "No updates allowed"
  ON certificate_audit_log
  FOR UPDATE
  TO service_role
  USING (false);

CREATE POLICY "No deletes allowed"
  ON certificate_audit_log
  FOR DELETE
  TO service_role
  USING (false);
