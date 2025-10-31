-- Batch 7: Email Communication System - Core Tables

-- Email logs for auditing and de-duplication
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent','failed')),
  resend_id TEXT,
  error_message TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_user ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_time ON email_logs(sent_at);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS: users can see their own logs; admins/instructors can see all via policy roles (optional)
CREATE POLICY "Users can view their own email logs"
  ON email_logs FOR SELECT
  USING (coalesce(user_id, auth.uid()) = auth.uid());

-- Helper function: check if an email type was sent to a user within a period (for dedup)
CREATE OR REPLACE FUNCTION was_email_sent_recently(p_user_id UUID, p_email_type TEXT, p_hours INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM email_logs
    WHERE user_id = p_user_id
      AND email_type = p_email_type
      AND sent_at >= (now() - make_interval(hours => p_hours))
  ) INTO v_exists;
  RETURN v_exists;
END;
$$ LANGUAGE plpgsql STABLE;
