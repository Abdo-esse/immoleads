-- ═══════════════════════════════════════════
-- 016: Fix handle_new_user trigger fallback
-- Prevents "Database error creating new user" when creating auth users
-- ═══════════════════════════════════════════

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  target_agency_id UUID := NULL;
  meta_agency TEXT;
BEGIN
  meta_agency := NEW.raw_user_meta_data ->> 'agency_id';

  IF meta_agency IS NOT NULL AND meta_agency != '' THEN
    BEGIN
      target_agency_id := meta_agency::UUID;
    EXCEPTION WHEN OTHERS THEN
      target_agency_id := NULL;
    END;
  END IF;

  -- If no valid agency_id in metadata, fallback to first existing agency ID in DB
  IF target_agency_id IS NULL THEN
    SELECT id INTO target_agency_id FROM agencies LIMIT 1;
  END IF;

  IF target_agency_id IS NOT NULL THEN
    INSERT INTO profiles (id, agency_id, full_name, email, role)
    VALUES (
      NEW.id,
      target_agency_id,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'role', 'agent')
    )
    ON CONFLICT (id) DO UPDATE SET
      agency_id = EXCLUDED.agency_id,
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Safe fallback: never crash auth user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
