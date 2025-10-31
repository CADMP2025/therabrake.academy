-- Allow admins to update certificates (for revocation)
-- Assumes profiles table includes role column and values include 'admin'
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can update certificates" ON certificates;
CREATE POLICY "Admins can update certificates"
  ON certificates
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
