-- ═════════════════════════════════════════════════════════════════════
-- 015: Enable Row Level Security on WHATSAPP_MESSAGES
-- Multi-tenant isolation: agency members can only access their agency's messages
-- ═════════════════════════════════════════════════════════════════════

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "agency_all_whatsapp_messages" ON public.whatsapp_messages;

CREATE POLICY "agency_all_whatsapp_messages" ON public.whatsapp_messages
  FOR ALL
  USING (
    agency_id = public.get_auth_agency_id()
  )
  WITH CHECK (
    agency_id = public.get_auth_agency_id()
  );
