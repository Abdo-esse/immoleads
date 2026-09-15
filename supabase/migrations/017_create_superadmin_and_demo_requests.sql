-- ═════════════════════════════════════════════════════════════════════
-- 017: Create SuperAdmin Role, Demo Requests Table & Multi-Agency RLS
-- ═════════════════════════════════════════════════════════════════════

-- 1. Allow profiles.agency_id to be NULL (for independent SuperAdmins)
ALTER TABLE public.profiles ALTER COLUMN agency_id DROP NOT NULL;

-- 2. Update role constraint to include 'superadmin'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('superadmin', 'admin', 'agent'));

-- 3. Update handle_new_user() trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  target_agency_id UUID := NULL;
  meta_agency TEXT;
  meta_role TEXT;
BEGIN
  meta_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'agent');
  meta_agency := NEW.raw_user_meta_data ->> 'agency_id';

  IF meta_agency IS NOT NULL AND meta_agency != '' THEN
    BEGIN
      target_agency_id := meta_agency::UUID;
    EXCEPTION WHEN OTHERS THEN
      target_agency_id := NULL;
    END;
  END IF;

  -- If not superadmin and no valid agency_id in metadata, fallback to first existing agency ID in DB
  IF meta_role != 'superadmin' AND target_agency_id IS NULL THEN
    SELECT id INTO target_agency_id FROM public.agencies LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, agency_id, full_name, email, role)
  VALUES (
    NEW.id,
    target_agency_id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email,
    meta_role
  )
  ON CONFLICT (id) DO UPDATE SET
    agency_id = EXCLUDED.agency_id,
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Safe fallback: never crash auth user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create demo_requests table
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     TEXT NOT NULL,
  phone         TEXT NOT NULL,
  agency_name   TEXT,
  city          TEXT NOT NULL,
  team_size     TEXT,
  lead_sources  TEXT[],
  monthly_leads TEXT,
  main_problem  TEXT,
  status        TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED')),
  notes         TEXT,
  agency_id     UUID REFERENCES public.agencies (id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON public.demo_requests (status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON public.demo_requests (created_at DESC);

-- 5. Enable RLS on demo_requests
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow public insert from landing page
DROP POLICY IF EXISTS "Allow public insert to demo_requests" ON public.demo_requests;
CREATE POLICY "Allow public insert to demo_requests"
  ON public.demo_requests FOR INSERT
  WITH CHECK (true);

-- Allow superadmins full access to demo_requests
DROP POLICY IF EXISTS "superadmin_manage_demo_requests" ON public.demo_requests;
CREATE POLICY "superadmin_manage_demo_requests"
  ON public.demo_requests FOR ALL
  USING (public.get_auth_role() = 'superadmin');

-- 6. Grant SuperAdmin universal access across existing tables
DROP POLICY IF EXISTS "superadmin_all_profiles" ON public.profiles;
CREATE POLICY "superadmin_all_profiles" ON public.profiles
  FOR ALL
  USING (public.get_auth_role() = 'superadmin');

DROP POLICY IF EXISTS "superadmin_all_agencies" ON public.agencies;
CREATE POLICY "superadmin_all_agencies" ON public.agencies
  FOR ALL
  USING (public.get_auth_role() = 'superadmin');

DROP POLICY IF EXISTS "superadmin_all_leads" ON public.leads;
CREATE POLICY "superadmin_all_leads" ON public.leads
  FOR ALL
  USING (public.get_auth_role() = 'superadmin');
