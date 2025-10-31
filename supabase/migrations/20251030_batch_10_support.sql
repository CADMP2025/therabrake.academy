-- Batch 10: Student Support System (FAQs, Guides, Tickets, Chatbot foundations)
-- Schema for FAQs, categories, versions, feedback, videos, guides, KB, troubleshooting wizards, tickets, comments

-- FAQ Categories
CREATE TABLE IF NOT EXISTS faq_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- FAQ Articles
CREATE TABLE IF NOT EXISTS faq_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES faq_categories(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  search_tsv tsvector
);

-- FAQ Article Versions (version control)
CREATE TABLE IF NOT EXISTS faq_article_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES faq_articles(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  change_summary TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (article_id, version)
);

-- Feedback on FAQ helpfulness
CREATE TABLE IF NOT EXISTS faq_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES faq_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  was_helpful BOOLEAN NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (article_id, user_id)
);

-- Tutorials (video references)
CREATE TABLE IF NOT EXISTS tutorial_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT,
  duration_seconds INTEGER,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Step-by-step Guides
CREATE TABLE IF NOT EXISTS support_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]'::jsonb, -- [{title, body, image_url}]
  is_published BOOLEAN DEFAULT false,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Knowledge Base Articles
CREATE TABLE IF NOT EXISTS knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT,
  keywords TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  search_tsv tsvector
);

-- Troubleshooting Wizards (simple tree/flow as JSON)
CREATE TABLE IF NOT EXISTS troubleshooting_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  flow JSONB NOT NULL, -- structure of questions/answers -> next nodes
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Support Tickets
CREATE TYPE ticket_status AS ENUM ('open', 'pending', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status ticket_status DEFAULT 'open',
  priority ticket_priority DEFAULT 'normal',
  category TEXT, -- maps to FAQ categories optionally
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- commenter
  author_role TEXT DEFAULT 'user', -- 'user' | 'admin'
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Full-text search vector updates
CREATE OR REPLACE FUNCTION update_faq_search_tsv()
RETURNS trigger AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('english', coalesce(NEW.question,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.answer,'')), 'B') ||
    setweight(to_tsvector('english', array_to_string(coalesce(NEW.keywords, '{}'), ' ')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_kb_search_tsv()
RETURNS trigger AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('english', coalesce(NEW.title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.body,'')), 'B') ||
    setweight(to_tsvector('english', array_to_string(coalesce(NEW.keywords, '{}'), ' ')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_faq_search_tsv ON faq_articles;
CREATE TRIGGER trg_faq_search_tsv BEFORE INSERT OR UPDATE ON faq_articles
FOR EACH ROW EXECUTE FUNCTION update_faq_search_tsv();

DROP TRIGGER IF EXISTS trg_kb_search_tsv ON knowledge_base_articles;
CREATE TRIGGER trg_kb_search_tsv BEFORE INSERT OR UPDATE ON knowledge_base_articles
FOR EACH ROW EXECUTE FUNCTION update_kb_search_tsv();

CREATE INDEX IF NOT EXISTS idx_faq_tsv ON faq_articles USING GIN (search_tsv);
CREATE INDEX IF NOT EXISTS idx_kb_tsv ON knowledge_base_articles USING GIN (search_tsv);
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_faq_published ON faq_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_kb_published ON knowledge_base_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

-- Versioning: on update of faq_articles, insert into versions with incremented version
CREATE OR REPLACE FUNCTION snapshot_faq_version()
RETURNS trigger AS $$
DECLARE
  v_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version),0)+1 INTO v_version FROM faq_article_versions WHERE article_id = NEW.id;
  INSERT INTO faq_article_versions(article_id, version, question, answer, change_summary, updated_by)
  VALUES (NEW.id, v_version, NEW.question, NEW.answer, NEW.answer IS DISTINCT FROM OLD.answer OR NEW.question IS DISTINCT FROM OLD.question ? 'Content updated' : 'Metadata updated', NEW.updated_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_faq_version ON faq_articles;
CREATE TRIGGER trg_faq_version AFTER UPDATE ON faq_articles
FOR EACH ROW EXECUTE FUNCTION snapshot_faq_version();

-- RLS
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_article_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE troubleshooting_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;

-- Helper: Admin role check via profiles table
CREATE OR REPLACE FUNCTION is_admin(p_user_id uuid)
RETURNS BOOLEAN AS $$
DECLARE v_role TEXT; BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = p_user_id;
  RETURN v_role = 'admin';
END; $$ LANGUAGE plpgsql STABLE;

-- Policies
-- FAQs and KB can be read by anyone if published
CREATE POLICY "Public read published FAQs" ON faq_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admins read all FAQs" ON faq_articles FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));
CREATE POLICY "Admin manage FAQs" ON faq_articles FOR ALL USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Public read categories" ON faq_categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON faq_categories FOR ALL USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Admins read versions" ON faq_article_versions FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));
CREATE POLICY "Admins manage versions" ON faq_article_versions FOR ALL USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Authenticated can submit feedback" ON faq_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read feedback" ON faq_feedback FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Public read published tutorials" ON tutorial_videos FOR SELECT USING (is_published = true);
CREATE POLICY "Admin manage tutorials" ON tutorial_videos FOR ALL USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Public read published guides" ON support_guides FOR SELECT USING (is_published = true);
CREATE POLICY "Admin manage guides" ON support_guides FOR ALL USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Public read published KB" ON knowledge_base_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admin manage KB" ON knowledge_base_articles FOR ALL USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Public read published flows" ON troubleshooting_flows FOR SELECT USING (is_published = true);
CREATE POLICY "Admin manage flows" ON troubleshooting_flows FOR ALL USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- Tickets: users can read/write their own; admins see all
CREATE POLICY "Users manage own tickets" ON support_tickets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all tickets" ON support_tickets FOR ALL USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Users manage own ticket comments" ON ticket_comments FOR ALL USING (
  EXISTS (SELECT 1 FROM support_tickets t WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR is_admin(auth.uid())))
);

-- RPC to increment helpfulness counters safely
CREATE OR REPLACE FUNCTION increment_faq_counter(p_article_id uuid, p_column text)
RETURNS void AS $$
BEGIN
  IF p_column = 'helpful_count' THEN
    UPDATE faq_articles SET helpful_count = helpful_count + 1 WHERE id = p_article_id;
  ELSIF p_column = 'not_helpful_count' THEN
    UPDATE faq_articles SET not_helpful_count = not_helpful_count + 1 WHERE id = p_article_id;
  END IF;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed default FAQ categories
INSERT INTO faq_categories (slug, name, description, sort_order)
VALUES
  ('account', 'Account', 'Managing your account and login', 1),
  ('courses', 'Courses', 'Enrollment, progress, and lessons', 2),
  ('payments', 'Payments', 'Billing, refunds, and pricing', 3),
  ('certificates', 'Certificates', 'CE credits and certificate issues', 4),
  ('technical', 'Technical', 'Troubleshooting and browser/device issues', 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed a few starter FAQ articles (published)
INSERT INTO faq_articles (slug, category_id, question, answer, keywords, is_published)
SELECT 'reset-password', c.id, 'How do I reset my password?', 'Use the Forgot Password link on the login page. You''ll receive an email with a secure link to set a new password.', ARRAY['password','reset','login','email'], true
FROM faq_categories c WHERE c.slug = 'account' AND NOT EXISTS (SELECT 1 FROM faq_articles a WHERE a.slug='reset-password');

INSERT INTO faq_articles (slug, category_id, question, answer, keywords, is_published)
SELECT 'download-certificate', c.id, 'How do I download my certificate?', 'Go to Student > Certificates. Select a course and click Download. Certificates include QR code verification.', ARRAY['certificate','download','ce','verification'], true
FROM faq_categories c WHERE c.slug = 'certificates' AND NOT EXISTS (SELECT 1 FROM faq_articles a WHERE a.slug='download-certificate');

INSERT INTO faq_articles (slug, category_id, question, answer, keywords, is_published)
SELECT 'refund-policy', c.id, 'What is your refund policy?', 'We offer refunds within 14 days of purchase if less than 20% of the course is completed. See the Refund Policy page for details.', ARRAY['refund','billing','payment'], true
FROM faq_categories c WHERE c.slug = 'payments' AND NOT EXISTS (SELECT 1 FROM faq_articles a WHERE a.slug='refund-policy');
