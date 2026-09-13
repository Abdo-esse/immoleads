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
