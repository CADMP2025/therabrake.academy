CREATE TABLE IF NOT EXISTS certificate_mail_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','in_progress','shipped','delivered','canceled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE certificate_mail_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own mail requests" ON certificate_mail_requests;
CREATE POLICY "Users manage own mail requests"
  ON certificate_mail_requests
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_cmr_user ON certificate_mail_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_cmr_cert ON certificate_mail_requests(certificate_id);
