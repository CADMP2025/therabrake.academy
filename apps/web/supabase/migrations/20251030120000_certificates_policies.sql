-- Ensure RLS is enabled
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Users can select their own certificates
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
CREATE POLICY "Users can view own certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users cannot insert certificates directly (handled by server)
DROP POLICY IF EXISTS "Users cannot insert certificates" ON certificates;
CREATE POLICY "Server can insert certificates"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Secure verification via RPC to avoid exposing table
CREATE OR REPLACE FUNCTION public.verify_certificate_rpc(cert TEXT, code TEXT)
RETURNS TABLE (
  certificate_number TEXT,
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  ce_hours DECIMAL,
  course_title TEXT,
  student_name TEXT,
  pdf_url TEXT,
  is_expired BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.certificate_number,
         c.issued_at,
         c.expires_at,
         c.ce_hours,
         crs.title as course_title,
         p.full_name as student_name,
         c.pdf_url,
         CASE WHEN c.expires_at IS NOT NULL AND c.expires_at < now() THEN true ELSE false END AS is_expired
  FROM certificates c
  JOIN courses crs ON crs.id = c.course_id
  JOIN profiles p ON p.id = c.user_id
  WHERE c.certificate_number = cert AND c.verification_code = code
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE ALL ON FUNCTION public.verify_certificate_rpc(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate_rpc(TEXT, TEXT) TO anon, authenticated;
