-- ═══════════════════════════════════════════
-- 001: Create agencies table
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS agencies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  city        TEXT,
  logo_url    TEXT,
  whatsapp_number TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for lookups
CREATE INDEX idx_agencies_name ON agencies (name);
-- ═══════════════════════════════════════════
-- 002: Create profiles table
-- Extends Supabase auth.users with app-specific data
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  agency_id   UUID NOT NULL REFERENCES agencies (id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_profiles_agency_id ON profiles (agency_id);
CREATE INDEX idx_profiles_role ON profiles (role);

-- Automatically create a profile when a new auth user signs up
-- (The admin must set the agency_id and role afterward)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, agency_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data ->> 'agency_id')::UUID,
      '00000000-0000-0000-0000-000000000000'::UUID
    ),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
-- ═══════════════════════════════════════════
-- 003: Create properties table
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS properties (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id         UUID NOT NULL REFERENCES agencies (id) ON DELETE CASCADE,
  assigned_agent_id UUID REFERENCES profiles (id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT,
  price             NUMERIC NOT NULL CHECK (price >= 0),
  city              TEXT NOT NULL,
  district          TEXT,
  type              TEXT NOT NULL CHECK (type IN ('apartment', 'villa', 'studio', 'riad', 'terrain', 'commercial')),
  transaction_type  TEXT NOT NULL CHECK (transaction_type IN ('sale', 'rent')),
  bedrooms          INT,
  bathrooms         INT,
  area              NUMERIC,
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'sold', 'rented')),
  images            TEXT[] DEFAULT '{}',
  features          JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_properties_agency_id ON properties (agency_id);
CREATE INDEX idx_properties_slug ON properties (slug);
CREATE INDEX idx_properties_status ON properties (status);
CREATE INDEX idx_properties_city ON properties (city);
CREATE INDEX idx_properties_type ON properties (type);
CREATE INDEX idx_properties_assigned_agent ON properties (assigned_agent_id);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ═══════════════════════════════════════════
-- 004: Create leads table
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id         UUID NOT NULL REFERENCES agencies (id) ON DELETE CASCADE,
  property_id       UUID REFERENCES properties (id) ON DELETE SET NULL,
  assigned_to       UUID REFERENCES profiles (id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  budget_min        NUMERIC,
  budget_max        NUMERIC,
  city              TEXT,
  property_type     TEXT,
  transaction_type  TEXT,
  timeline          TEXT CHECK (timeline IN ('immediate', '1-3months', '3-6months', '6months+')),
  source            TEXT CHECK (source IN ('website', 'facebook', 'instagram', 'google', 'referral', 'other')),
  utm_source        TEXT,
  utm_campaign      TEXT,
  utm_content       TEXT,
  referrer          TEXT,
  status            TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'WON', 'LOST')),
  lost_reason       TEXT CHECK (lost_reason IN ('budget_mismatch', 'not_interested', 'no_response', 'bought_elsewhere', 'postponed', 'other')),
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_leads_agency_id ON leads (agency_id);
CREATE INDEX idx_leads_status ON leads (status);
CREATE INDEX idx_leads_assigned_to ON leads (assigned_to);
CREATE INDEX idx_leads_property_id ON leads (property_id);
CREATE INDEX idx_leads_source ON leads (source);
CREATE INDEX idx_leads_next_follow_up ON leads (next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);

-- Auto-update updated_at
CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ═══════════════════════════════════════════
-- 005: Create lead_notes table
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS lead_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fetching notes by lead
CREATE INDEX idx_lead_notes_lead_id ON lead_notes (lead_id);
CREATE INDEX idx_lead_notes_created_at ON lead_notes (lead_id, created_at DESC);
-- ═══════════════════════════════════════════
-- 006: Create visits table
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS visits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
  agent_id    UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  agency_id   UUID NOT NULL REFERENCES agencies (id) ON DELETE CASCADE,
  visit_date  DATE NOT NULL,
  visit_time  TIME NOT NULL,
  status      TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_visits_agency_id ON visits (agency_id);
CREATE INDEX idx_visits_lead_id ON visits (lead_id);
CREATE INDEX idx_visits_agent_id ON visits (agent_id);
CREATE INDEX idx_visits_date ON visits (visit_date, visit_time);
CREATE INDEX idx_visits_status ON visits (status);
CREATE INDEX idx_visits_upcoming ON visits (visit_date, visit_time)
  WHERE status = 'SCHEDULED';
-- ═══════════════════════════════════════════
-- 007: Create lead_activities table (audit trail)
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS lead_activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles (id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  details     TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_lead_activities_lead_id ON lead_activities (lead_id);
CREATE INDEX idx_lead_activities_created_at ON lead_activities (lead_id, created_at DESC);
CREATE INDEX idx_lead_activities_action ON lead_activities (action);
-- ═══════════════════════════════════════════
-- 008: Enable Row Level Security + Policies
-- Multi-tenant isolation: users only see their agency's data
-- ═══════════════════════════════════════════

-- ═══════════════════════════════════════════
-- AGENCIES — users can only read their own agency
-- ═══════════════════════════════════════════
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_agency" ON agencies
  FOR SELECT USING (
    id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- PROFILES — admin sees all in agency, agent sees self
-- ═══════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_profiles" ON profiles
  FOR ALL USING (
    agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "agent_read_self" ON profiles
  FOR SELECT USING (id = auth.uid());

-- ═══════════════════════════════════════════
-- PROPERTIES — agency-scoped management + public read for active
-- ═══════════════════════════════════════════
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_manage_properties" ON properties
  FOR ALL USING (
    agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "public_read_active_properties" ON properties
  FOR SELECT USING (status = 'active');

-- ═══════════════════════════════════════════
-- LEADS — admin sees all, agent sees assigned only
-- NO public INSERT policy. Inserts via service-role only.
-- ═══════════════════════════════════════════
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_leads" ON leads
  FOR ALL USING (
    agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "agent_read_assigned_leads" ON leads
  FOR SELECT USING (
    assigned_to = auth.uid()
    AND agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "agent_update_assigned_leads" ON leads
  FOR UPDATE USING (
    assigned_to = auth.uid()
    AND agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- LEAD_NOTES — agency-scoped read, author can create
-- ═══════════════════════════════════════════
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_read_notes" ON lead_notes
  FOR SELECT USING (
    lead_id IN (
      SELECT id FROM leads WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "user_create_notes" ON lead_notes
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- ═══════════════════════════════════════════
-- VISITS — agency-scoped
-- ═══════════════════════════════════════════
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_manage_visits" ON visits
  FOR ALL USING (
    agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- LEAD_ACTIVITIES — agency-scoped read, user can create
-- ═══════════════════════════════════════════
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_read_activities" ON lead_activities
  FOR SELECT USING (
    lead_id IN (
      SELECT id FROM leads WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "user_create_activities" ON lead_activities
  FOR INSERT WITH CHECK (user_id = auth.uid());
