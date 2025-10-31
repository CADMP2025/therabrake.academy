-- Add revocation fields to certificates
ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS revoked BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS revoked_reason TEXT;

-- Verification attempts table (for fraud detection)
CREATE TABLE IF NOT EXISTS verification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT,
  verification_code_hash TEXT,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ver_attempts_ip_time ON verification_attempts(ip_address, created_at);
CREATE INDEX IF NOT EXISTS idx_ver_attempts_cert_time ON verification_attempts(certificate_number, created_at);

ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;
-- Allow anon insert (public verification)
DROP POLICY IF EXISTS "Anon can insert verification attempts" ON verification_attempts;
CREATE POLICY "Anon can insert verification attempts"
  ON verification_attempts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Update verification RPC to include revocation and certificate id
CREATE OR REPLACE FUNCTION public.verify_certificate_rpc(cert TEXT, code TEXT)
RETURNS TABLE (
  certificate_id UUID,
  certificate_number TEXT,
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  ce_hours DECIMAL,
  course_title TEXT,
  student_name TEXT,
  pdf_url TEXT,
  is_expired BOOLEAN,
  is_revoked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id as certificate_id,
         c.certificate_number,
         c.issued_at,
         c.expires_at,
         c.ce_hours,
         crs.title as course_title,
         p.full_name as student_name,
         c.pdf_url,
         CASE WHEN c.expires_at IS NOT NULL AND c.expires_at < now() THEN true ELSE false END AS is_expired,
         c.revoked as is_revoked
  FROM certificates c
  JOIN courses crs ON crs.id = c.course_id
  JOIN profiles p ON p.id = c.user_id
  WHERE c.certificate_number = cert AND c.verification_code = code
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE ALL ON FUNCTION public.verify_certificate_rpc(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate_rpc(TEXT, TEXT) TO anon, authenticated;
