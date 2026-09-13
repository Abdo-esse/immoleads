-- ═══════════════════════════════════════
-- 013: WhatsApp Business API settings
-- ═══════════════════════════════════════

ALTER TABLE agencies ADD COLUMN IF NOT EXISTS wa_phone_id TEXT;
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS wa_access_token TEXT;
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS wa_business_id TEXT;

-- Track sent messages for history
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID NOT NULL REFERENCES agencies (id) ON DELETE CASCADE,
  lead_id     UUID NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  sender_id   UUID REFERENCES profiles (id) ON DELETE SET NULL,
  phone       TEXT NOT NULL,
  message     TEXT NOT NULL,
  template    TEXT,
  status      TEXT NOT NULL DEFAULT 'sent',
  wa_message_id TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wa_messages_lead ON whatsapp_messages (lead_id, created_at DESC);
CREATE INDEX idx_wa_messages_agency ON whatsapp_messages (agency_id);
