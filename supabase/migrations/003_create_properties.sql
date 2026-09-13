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
