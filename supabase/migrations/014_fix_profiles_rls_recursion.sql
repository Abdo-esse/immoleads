-- ═════════════════════════════════════════════════════════════════════
-- 014: Fix Infinite Recursion in PROFILES RLS Policies
-- ═════════════════════════════════════════════════════════════════════
-- Problem: The policy on "profiles" queried "profiles" via subquery,
-- causing PostgreSQL error: "infinite recursion detected in policy for relation profiles".
--
-- Solution:
-- 1. Create SECURITY DEFINER helper functions to look up agency_id and role
--    without triggering RLS recursion.
-- 2. Re-create the policies on profiles and leads using these helper functions.
-- ═════════════════════════════════════════════════════════════════════

-- 1. Helper function to get current user's agency_id without triggering RLS
CREATE OR REPLACE FUNCTION public.get_auth_agency_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT agency_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Helper function to get current user's role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. Drop existing recursive policies on profiles
DROP POLICY IF EXISTS "admin_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "agent_read_self" ON public.profiles;
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.profiles;

-- 4. Re-create non-recursive policies on profiles
-- Users can view and edit their own profile
CREATE POLICY "users_manage_own_profile" ON public.profiles
  FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can view and manage all profiles in their own agency
CREATE POLICY "admin_all_profiles" ON public.profiles
  FOR ALL
  USING (
    agency_id = public.get_auth_agency_id()
    AND public.get_auth_role() = 'admin'
  );

-- 5. Re-create policies on leads using helper functions
DROP POLICY IF EXISTS "admin_all_leads" ON public.leads;
DROP POLICY IF EXISTS "agent_read_assigned_leads" ON public.leads;
DROP POLICY IF EXISTS "agent_update_assigned_leads" ON public.leads;

CREATE POLICY "admin_all_leads" ON public.leads
  FOR ALL
  USING (
    agency_id = public.get_auth_agency_id()
    AND public.get_auth_role() = 'admin'
  );

CREATE POLICY "agent_read_assigned_leads" ON public.leads
  FOR SELECT
  USING (
    assigned_to = auth.uid()
    AND agency_id = public.get_auth_agency_id()
  );

CREATE POLICY "agent_update_assigned_leads" ON public.leads
  FOR UPDATE
  USING (
    assigned_to = auth.uid()
    AND agency_id = public.get_auth_agency_id()
  );
