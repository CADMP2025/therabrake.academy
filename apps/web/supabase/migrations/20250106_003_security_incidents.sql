-- Security incident tracking
CREATE TABLE IF NOT EXISTS security_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL,
  contained_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  notified_at TIMESTAMPTZ,
  affected_users TEXT[],
  affected_data TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'contained', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_incidents_severity ON security_incidents(severity, detected_at DESC);
CREATE INDEX idx_incidents_status ON security_incidents(status);

-- Incident reports
CREATE TABLE IF NOT EXISTS incident_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES security_incidents(id),
  report_date TIMESTAMPTZ DEFAULT NOW(),
  summary TEXT,
  timeline JSONB,
  affected_users_count INTEGER,
  affected_data TEXT[],
  remediation_steps TEXT[],
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User data deletion requests (GDPR/CCPA)
CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'processing', 'completed', 'rejected')),
  verification_method TEXT,
  deletion_type TEXT DEFAULT 'full' CHECK (deletion_type IN ('full', 'partial', 'anonymize')),
  retained_data JSONB, -- Records we must keep for compliance
  notes TEXT
);

CREATE INDEX idx_deletion_requests_user ON data_deletion_requests(user_id);
CREATE INDEX idx_deletion_requests_status ON data_deletion_requests(status);
