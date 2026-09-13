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
