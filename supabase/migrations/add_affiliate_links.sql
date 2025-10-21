-- Create instructor_affiliate_links table
CREATE TABLE IF NOT EXISTS instructor_affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  affiliate_code TEXT UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- 10% commission
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_links_code ON instructor_affiliate_links(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_instructor ON instructor_affiliate_links(instructor_id);

-- Create function to increment click count
CREATE OR REPLACE FUNCTION increment_affiliate_click(link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE instructor_affiliate_links
  SET 
    click_count = click_count + 1,
    last_used_at = NOW(),
    updated_at = NOW()
  WHERE id = link_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE instructor_affiliate_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Instructors can view own affiliate links"
  ON instructor_affiliate_links FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can create own affiliate links"
  ON instructor_affiliate_links FOR INSERT
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update own affiliate links"
  ON instructor_affiliate_links FOR UPDATE
  USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can view all affiliate links"
  ON instructor_affiliate_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Create affiliate conversions tracking table
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_link_id UUID NOT NULL REFERENCES instructor_affiliate_links(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_link ON affiliate_conversions(affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_user ON affiliate_conversions(user_id);

-- Enable RLS
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors can view own conversions"
  ON affiliate_conversions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM instructor_affiliate_links
      WHERE id = affiliate_conversions.affiliate_link_id
      AND instructor_id = auth.uid()
    )
  );
