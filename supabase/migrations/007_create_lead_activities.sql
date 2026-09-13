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
