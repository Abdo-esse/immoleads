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
