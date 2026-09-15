-- ═════════════════════════════════════════════════════════════════════
-- 018: Nettoyage et Configuration du Compte SuperAdmin
-- ═════════════════════════════════════════════════════════════════════
-- Pourquoi l'erreur "Database error querying schema" est survenue :
-- Dans Supabase, insérer manuellement dans auth.users via SQL brut sans
-- passer par l'API GoTrue omet la table auth.identities et des colonnes
-- internes requises, ce qui bloque la connexion.
-- ═════════════════════════════════════════════════════════════════════

-- ÉTAPE 1 : Nettoyer l'entrée corrompue dans auth.users
DELETE FROM auth.users WHERE email = 'superadmin@atloryx.com';
DELETE FROM public.profiles WHERE email = 'superadmin@atloryx.com';

-- ═════════════════════════════════════════════════════════════════════
-- ÉTAPE 2 : Créer l'utilisateur dans Supabase Dashboard
-- 1. Allez dans Authentication -> Users
-- 2. Cliquez sur "Add user" -> "Create user"
-- 3. Email: superadmin@atloryx.com
-- 4. Password: AtloryxSuperAdmin2026!
-- 5. Cochez "Auto Confirm User"
-- ═════════════════════════════════════════════════════════════════════

-- ÉTAPE 3 : Une fois créé, exécuter cette ligne pour lui donner le rôle SuperAdmin :
-- UPDATE public.profiles
-- SET role = 'superadmin', agency_id = NULL
-- WHERE email = 'superadmin@atloryx.com';

-- ALTERNATIVE IMMÉDIATE : Si vous avez DÉJÀ un compte fonctionnel (ex: votre email personnel)
-- Il vous suffit d'exécuter cette commande pour devenir SuperAdmin immédiatement :
-- UPDATE public.profiles SET role = 'superadmin', agency_id = NULL WHERE email = 'VOTRE_EMAIL_ACTUEL';
