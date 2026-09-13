-- ═══════════════════════════════════════════
-- 010: Create notifications table + Realtime
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID NOT NULL REFERENCES agencies (id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles (id) ON DELETE CASCADE, -- NULL = all agents in agency
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('lead_created', 'lead_assigned', 'visit_scheduled', 'system')),
  link        TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_agency ON notifications (agency_id, is_read, created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read notifications addressed to them or to their entire agency
CREATE POLICY "users_read_notifications" ON notifications
  FOR SELECT USING (
    user_id = auth.uid() OR (user_id IS NULL AND agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid()))
  );

-- Users can update (mark as read) their notifications
CREATE POLICY "users_update_notifications" ON notifications
  FOR UPDATE USING (
    user_id = auth.uid() OR (user_id IS NULL AND agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid()))
  );

-- Enable Supabase Realtime for instant push updates
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
