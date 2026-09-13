-- ═══════════════════════════════════════════
-- 009: Seed Demo Data
-- Agency: ImmoMaroc Agency
-- Admin: Directeur Omar
-- Agents: Mehdi Bennis, Nadia Tazi
-- 6 Properties, 6 Leads, Visits, Notes, Activities
--
-- NOTE: Auth users must be created FIRST in Supabase dashboard
-- or via the Auth API before running this seed.
-- The UUIDs below must match the auth.users IDs.
-- ═══════════════════════════════════════════

-- Fixed UUIDs for demo (replace with actual auth.users IDs)
-- Agency
INSERT INTO agencies (id, name, phone, email, city, whatsapp_number)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'ImmoMaroc Agency',
  '+212 5 22 00 00 00',
  'contact@immomaroc.ma',
  'Marrakech',
  '212669808310'
);

-- Profiles (must match auth.users IDs — update after creating auth users)
-- Admin: Directeur Omar
INSERT INTO profiles (id, agency_id, full_name, email, phone, role)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Directeur Omar',
  'omar@immomaroc.ma',
  '+212 6 61 00 00 01',
  'admin'
);

-- Agent: Mehdi Bennis
INSERT INTO profiles (id, agency_id, full_name, email, phone, role)
VALUES (
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Mehdi Bennis',
  'mehdi@immomaroc.ma',
  '+212 6 61 00 00 02',
  'agent'
);

-- Agent: Nadia Tazi
INSERT INTO profiles (id, agency_id, full_name, email, phone, role)
VALUES (
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Nadia Tazi',
  'nadia@immomaroc.ma',
  '+212 6 61 00 00 03',
  'agent'
);

-- ═══════════════════════════════════════════
-- Properties
-- ═══════════════════════════════════════════

INSERT INTO properties (id, agency_id, assigned_agent_id, title, slug, description, price, city, district, type, transaction_type, bedrooms, bathrooms, area, status, images) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'Appartement T3 - Guéliz',
  'appartement-t3-gueliz-a82f',
  'Magnifique appartement T3 au cœur de Guéliz, lumineux avec balcon et vue dégagée. Proche de toutes commodités.',
  950000, 'Marrakech', 'Guéliz', 'apartment', 'sale', 3, 2, 95, 'active', '{}'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000003',
  'Villa avec Piscine - Route de Casablanca',
  'villa-avec-piscine-route-de-casablanca-b3k9',
  'Superbe villa avec piscine privée, jardin paysager et garage double. Quartier résidentiel calme.',
  2400000, 'Marrakech', 'Route de Casablanca', 'villa', 'sale', 5, 3, 350, 'active', '{}'
),
(
  'c0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'Studio Moderne - Agdal',
  'studio-moderne-agdal-c7d2',
  'Studio moderne entièrement rénové dans le quartier Agdal. Idéal pour investissement locatif.',
  720000, 'Rabat', 'Agdal', 'studio', 'sale', 1, 1, 45, 'active', '{}'
),
(
  'c0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000003',
  'Riad Rénové - Médina',
  'riad-renove-medina-d4e8',
  'Riad traditionnel entièrement rénové avec patio, fontaine et terrasse panoramique. Charme authentique.',
  1800000, 'Marrakech', 'Médina', 'riad', 'sale', 4, 3, 200, 'active', '{}'
),
(
  'c0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'Duplex Vue Mer - Corniche',
  'duplex-vue-mer-corniche-e5f1',
  'Duplex d''exception avec vue panoramique sur l''océan. Finitions haut de gamme, terrasse privative.',
  3200000, 'Casablanca', 'Corniche', 'apartment', 'sale', 4, 3, 180, 'active', '{}'
),
(
  'c0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000003',
  'Terrain 500m² - Route de l''Ourika',
  'terrain-500m2-route-de-lourika-f6g3',
  'Terrain plat de 500m² avec vue sur l''Atlas. Titre foncier, idéal pour construction villa.',
  1100000, 'Marrakech', 'Route de l''Ourika', 'terrain', 'sale', NULL, NULL, 500, 'active', '{}'
);

-- ═══════════════════════════════════════════
-- Leads
-- ═══════════════════════════════════════════

INSERT INTO leads (id, agency_id, property_id, assigned_to, name, phone, email, budget_min, budget_max, city, property_type, transaction_type, timeline, source, status, next_follow_up_at, last_contacted_at) VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'Ahmed Benali', '+212661234501', 'ahmed.benali@gmail.com',
  800000, 1200000, 'Marrakech', 'apartment', 'sale', '1-3months', 'facebook',
  'QUALIFIED',
  now() + interval '1 day' + interval '10 hours 30 minutes',
  now() - interval '2 days'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000003',
  'Sara Amrani', '+212662234502', 'sara.amrani@gmail.com',
  2000000, 3000000, 'Marrakech', 'villa', 'sale', 'immediate', 'instagram',
  'VISIT_SCHEDULED',
  NULL,
  now() - interval '1 day'
),
(
  'd0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000002',
  'Youssef Alaoui', '+212663234503', NULL,
  600000, 900000, 'Rabat', 'studio', 'sale', '1-3months', 'google',
  'CONTACTED',
  now() + interval '14 hours',
  now() - interval '3 days'
),
(
  'd0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000004',
  NULL,
  'Fatima Zahrae', '+212664234504', 'fatima.z@gmail.com',
  1500000, 2500000, 'Marrakech', 'riad', 'sale', '3-6months', 'website',
  'NEW',
  NULL,
  NULL
),
(
  'd0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000002',
  'Karim Idrissi', '+212665234505', 'karim.id@outlook.com',
  2800000, 3500000, 'Casablanca', 'apartment', 'sale', 'immediate', 'referral',
  'NEGOTIATION',
  now() + interval '11 hours',
  now() - interval '1 day'
),
(
  'd0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000003',
  'Amina Berrada', '+212666234506', 'amina.b@gmail.com',
  500000, 700000, 'Marrakech', 'apartment', 'sale', '1-3months', 'facebook',
  'LOST',
  NULL,
  now() - interval '5 days'
);

-- Set lost_reason for Amina (LOST lead)
UPDATE leads
SET lost_reason = 'budget_mismatch'
WHERE id = 'd0000000-0000-0000-0000-000000000006';

-- ═══════════════════════════════════════════
-- Visits
-- ═══════════════════════════════════════════

INSERT INTO visits (id, lead_id, property_id, agent_id, agency_id, visit_date, visit_time, status, notes) VALUES
(
  'e0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  CURRENT_DATE + 2,
  '10:00',
  'SCHEDULED',
  'La cliente veut voir la piscine et le jardin en priorité.'
),
(
  'e0000000-0000-0000-0000-000000000002',
  'd0000000-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  CURRENT_DATE + 1,
  '15:30',
  'SCHEDULED',
  'Client très motivé, préparer les documents du bien.'
);

-- ═══════════════════════════════════════════
-- Lead Notes
-- ═══════════════════════════════════════════

INSERT INTO lead_notes (lead_id, author_id, content) VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Client très intéressé par le T3 Guéliz. Budget correct. À relancer demain pour fixer une visite.'),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'Visite programmée samedi matin. La cliente vient avec son mari.'),
('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Négociation en cours. Le client propose 3M DH, propriétaire demande 3.2M. En attente de contre-offre.');

-- ═══════════════════════════════════════════
-- Lead Activities (audit trail)
-- ═══════════════════════════════════════════

INSERT INTO lead_activities (lead_id, user_id, action, details) VALUES
('d0000000-0000-0000-0000-000000000001', NULL, 'lead_created', 'Lead créé via formulaire Facebook'),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'agent_assigned', 'Assigné à Mehdi Bennis'),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'status_changed', 'NEW → CONTACTED'),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'status_changed', 'CONTACTED → QUALIFIED'),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'follow_up_scheduled', 'Relance prévue demain 10h30'),
('d0000000-0000-0000-0000-000000000002', NULL, 'lead_created', 'Lead créé via formulaire Instagram'),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'visit_scheduled', 'Visite de la villa samedi 10h'),
('d0000000-0000-0000-0000-000000000003', NULL, 'lead_created', 'Lead créé via Google Ads'),
('d0000000-0000-0000-0000-000000000004', NULL, 'lead_created', 'Lead créé via le site web'),
('d0000000-0000-0000-0000-000000000005', NULL, 'lead_created', 'Lead créé via recommandation'),
('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'status_changed', 'QUALIFIED → NEGOTIATION'),
('d0000000-0000-0000-0000-000000000006', NULL, 'lead_created', 'Lead créé via Facebook'),
('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'status_changed', 'CONTACTED → LOST (budget_mismatch)');
