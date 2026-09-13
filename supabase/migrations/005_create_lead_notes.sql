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
