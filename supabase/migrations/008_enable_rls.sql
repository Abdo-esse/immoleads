-- ═══════════════════════════════════════════
-- 008: Enable Row Level Security + Policies
-- Multi-tenant isolation: users only see their agency's data
-- ═══════════════════════════════════════════

-- ═══════════════════════════════════════════
-- AGENCIES — users can only read their own agency
-- ═══════════════════════════════════════════
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_agency" ON agencies
  FOR SELECT USING (
    id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- PROFILES — admin sees all in agency, agent sees self
-- ═══════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_profiles" ON profiles
  FOR ALL USING (
    agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "agent_read_self" ON profiles
  FOR SELECT USING (id = auth.uid());

-- ═══════════════════════════════════════════
-- PROPERTIES — agency-scoped management + public read for active
-- ═══════════════════════════════════════════
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_manage_properties" ON properties
  FOR ALL USING (
    agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "public_read_active_properties" ON properties
  FOR SELECT USING (status = 'active');

-- ═══════════════════════════════════════════
-- LEADS — admin sees all, agent sees assigned only
-- NO public INSERT policy. Inserts via service-role only.
-- ═══════════════════════════════════════════
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_leads" ON leads
  FOR ALL USING (
    agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "agent_read_assigned_leads" ON leads
  FOR SELECT USING (
    assigned_to = auth.uid()
    AND agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "agent_update_assigned_leads" ON leads
  FOR UPDATE USING (
    assigned_to = auth.uid()
    AND agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- LEAD_NOTES — agency-scoped read, author can create
-- ═══════════════════════════════════════════
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_read_notes" ON lead_notes
  FOR SELECT USING (
    lead_id IN (
      SELECT id FROM leads WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "user_create_notes" ON lead_notes
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- ═══════════════════════════════════════════
-- VISITS — agency-scoped
-- ═══════════════════════════════════════════
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_manage_visits" ON visits
  FOR ALL USING (
    agency_id = (SELECT agency_id FROM profiles WHERE id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- LEAD_ACTIVITIES — agency-scoped read, user can create
-- ═══════════════════════════════════════════
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agency_read_activities" ON lead_activities
  FOR SELECT USING (
    lead_id IN (
      SELECT id FROM leads WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "user_create_activities" ON lead_activities
  FOR INSERT WITH CHECK (user_id = auth.uid());
