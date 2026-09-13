-- ═══════════════════════════════════════════
-- 011: Enable Supabase Realtime for Leads & Notifications
-- ═══════════════════════════════════════════

-- Ensure full replica identity for realtime row updates
ALTER TABLE leads REPLICA IDENTITY FULL;
ALTER TABLE lead_activities REPLICA IDENTITY FULL;
ALTER TABLE visits REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE leads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'lead_activities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE lead_activities;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'visits'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE visits;
  END IF;
END $$;
