-- ═══════════════════════════════════════════
-- 002: Create profiles table
-- Extends Supabase auth.users with app-specific data
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  agency_id   UUID NOT NULL REFERENCES agencies (id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_profiles_agency_id ON profiles (agency_id);
CREATE INDEX idx_profiles_role ON profiles (role);

-- Automatically create a profile when a new auth user signs up
-- (The admin must set the agency_id and role afterward)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, agency_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data ->> 'agency_id')::UUID,
      '00000000-0000-0000-0000-000000000000'::UUID
    ),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
