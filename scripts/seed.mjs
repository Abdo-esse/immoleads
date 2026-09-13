// ═══════════════════════════════════════════
// ImmoLeads — Database Setup Script
// Creates auth users + seeds all demo data via Supabase REST API
// Run: node --env-file=.env.local scripts/seed.mjs
// ═══════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ── Load env ──────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

let supabaseUrl, serviceRoleKey

try {
  const envFile = readFileSync(resolve(rootDir, '.env.local'), 'utf-8')
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim().replace(/\r$/, '')
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') serviceRoleKey = value
  }
} catch {
  console.error('❌ Could not read .env.local')
  process.exit(1)
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Constants ─────────────────────────────
const AGENCY_ID = 'a0000000-0000-0000-0000-000000000001'
const PASSWORD = 'Demo@123456'

// ── Helpers ───────────────────────────────
function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`)
}

async function upsertRow(table, data) {
  const { error } = await supabase.from(table).upsert(data, { onConflict: 'id' })
  if (error) throw new Error(`${table} upsert failed: ${error.message}`)
}

// ── Main ──────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════╗')
  console.log('║   ImmoLeads — Database Seed Script   ║')
  console.log('╚══════════════════════════════════════╝\n')

  // ────────────────────────────────────────
  // 1. CREATE AGENCY
  // ────────────────────────────────────────
  log('🏢', 'Creating agency: ImmoMaroc Agency...')
  await upsertRow('agencies', {
    id: AGENCY_ID,
    name: 'ImmoMaroc Agency',
    phone: '+212 5 22 00 00 00',
    email: 'contact@immomaroc.ma',
    city: 'Marrakech',
    whatsapp_number: '212669808310',
  })
  log('✅', 'Agency created')

  // ────────────────────────────────────────
  // 2. CREATE AUTH USERS
  // ────────────────────────────────────────
  const usersToCreate = [
    { email: 'omar@immomaroc.ma', full_name: 'Directeur Omar', phone: '+212 6 61 00 00 01', role: 'admin' },
    { email: 'mehdi@immomaroc.ma', full_name: 'Mehdi Bennis', phone: '+212 6 61 00 00 02', role: 'agent' },
    { email: 'nadia@immomaroc.ma', full_name: 'Nadia Tazi', phone: '+212 6 61 00 00 03', role: 'agent' },
  ]

  const userIds = {}

  for (const user of usersToCreate) {
    const key = user.role === 'admin' ? 'omar' : user.email.split('@')[0]
    log('👤', `Creating user: ${user.email} (${user.role})...`)

    // Create auth user (trigger is disabled, no auto-profile)
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: PASSWORD,
      email_confirm: true,
    })

    if (error) {
      if (error.message?.includes('already been registered') || error.message?.includes('already exists')) {
        const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 100 })
        const existing = listData?.users?.find((u) => u.email === user.email)
        if (existing) {
          userIds[key] = existing.id
          log('⚠️ ', `User already exists: ${existing.id}`)
        } else {
          log('❌', `Could not find existing user: ${user.email}`)
          continue
        }
      } else {
        log('❌', `Error: ${error.message}`)
        continue
      }
    } else {
      userIds[key] = data.user.id
      log('✅', `Created: ${data.user.id}`)
    }

    // Manually create profile (trigger is disabled)
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({
        id: userIds[key],
        agency_id: AGENCY_ID,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }, { onConflict: 'id' })

    if (profileErr) {
      log('⚠️ ', `Profile error: ${profileErr.message}`)
    } else {
      log('✅', `Profile created for ${user.email}`)
    }
  }

  const omarId = userIds.omar
  const mehdiId = userIds.mehdi
  const nadiaId = userIds.nadia

  if (!omarId || !mehdiId || !nadiaId) {
    console.error('\n❌ Could not get all user IDs:')
    console.error('  Omar:', omarId || 'MISSING')
    console.error('  Mehdi:', mehdiId || 'MISSING')
    console.error('  Nadia:', nadiaId || 'MISSING')
    process.exit(1)
  }

  console.log('\n📋 User IDs:')
  console.log(`  Omar  (admin): ${omarId}`)
  console.log(`  Mehdi (agent): ${mehdiId}`)
  console.log(`  Nadia (agent): ${nadiaId}`)

  // ────────────────────────────────────────
  // 3. SEED PROPERTIES
  // ────────────────────────────────────────
  log('\n🏠', 'Seeding properties...')

  const properties = [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      agency_id: AGENCY_ID, assigned_agent_id: mehdiId,
      title: 'Appartement T3 - Guéliz', slug: 'appartement-t3-gueliz-a82f',
      description: 'Magnifique appartement T3 au cœur de Guéliz, lumineux avec balcon et vue dégagée. Proche de toutes commodités.',
      price: 950000, city: 'Marrakech', district: 'Guéliz',
      type: 'apartment', transaction_type: 'sale',
      bedrooms: 3, bathrooms: 2, area: 95, status: 'active', images: [],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      agency_id: AGENCY_ID, assigned_agent_id: nadiaId,
      title: 'Villa avec Piscine - Route de Casablanca', slug: 'villa-avec-piscine-route-de-casablanca-b3k9',
      description: 'Superbe villa avec piscine privée, jardin paysager et garage double. Quartier résidentiel calme.',
      price: 2400000, city: 'Marrakech', district: 'Route de Casablanca',
      type: 'villa', transaction_type: 'sale',
      bedrooms: 5, bathrooms: 3, area: 350, status: 'active', images: [],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      agency_id: AGENCY_ID, assigned_agent_id: mehdiId,
      title: 'Studio Moderne - Agdal', slug: 'studio-moderne-agdal-c7d2',
      description: 'Studio moderne entièrement rénové dans le quartier Agdal. Idéal pour investissement locatif.',
      price: 720000, city: 'Rabat', district: 'Agdal',
      type: 'studio', transaction_type: 'sale',
      bedrooms: 1, bathrooms: 1, area: 45, status: 'active', images: [],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      agency_id: AGENCY_ID, assigned_agent_id: nadiaId,
      title: 'Riad Rénové - Médina', slug: 'riad-renove-medina-d4e8',
      description: 'Riad traditionnel entièrement rénové avec patio, fontaine et terrasse panoramique.',
      price: 1800000, city: 'Marrakech', district: 'Médina',
      type: 'riad', transaction_type: 'sale',
      bedrooms: 4, bathrooms: 3, area: 200, status: 'active', images: [],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000005',
      agency_id: AGENCY_ID, assigned_agent_id: mehdiId,
      title: 'Duplex Vue Mer - Corniche', slug: 'duplex-vue-mer-corniche-e5f1',
      description: "Duplex d'exception avec vue panoramique sur l'océan. Finitions haut de gamme, terrasse privative.",
      price: 3200000, city: 'Casablanca', district: 'Corniche',
      type: 'apartment', transaction_type: 'sale',
      bedrooms: 4, bathrooms: 3, area: 180, status: 'active', images: [],
    },
    {
      id: 'c0000000-0000-0000-0000-000000000006',
      agency_id: AGENCY_ID, assigned_agent_id: nadiaId,
      title: "Terrain 500m² - Route de l'Ourika", slug: 'terrain-500m2-route-de-lourika-f6g3',
      description: "Terrain plat de 500m² avec vue sur l'Atlas. Titre foncier, idéal pour construction villa.",
      price: 1100000, city: 'Marrakech', district: "Route de l'Ourika",
      type: 'terrain', transaction_type: 'sale',
      bedrooms: null, bathrooms: null, area: 500, status: 'active', images: [],
    },
  ]

  const { error: propErr } = await supabase.from('properties').upsert(properties, { onConflict: 'id' })
  if (propErr) log('❌', `Properties: ${propErr.message}`)
  else log('✅', `${properties.length} properties seeded`)

  // ────────────────────────────────────────
  // 4. SEED LEADS
  // ────────────────────────────────────────
  log('\n📋', 'Seeding leads...')

  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const todayAt14 = new Date(now); todayAt14.setHours(14, 0, 0, 0)
  const todayAt11 = new Date(now); todayAt11.setHours(11, 0, 0, 0)
  const tomorrowAt1030 = new Date(tomorrow); tomorrowAt1030.setHours(10, 30, 0, 0)

  const leads = [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      agency_id: AGENCY_ID, property_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_to: mehdiId,
      name: 'Ahmed Benali', phone: '+212661234501', email: 'ahmed.benali@gmail.com',
      budget_min: 800000, budget_max: 1200000,
      city: 'Marrakech', property_type: 'apartment', transaction_type: 'sale',
      timeline: '1-3months', source: 'facebook', status: 'QUALIFIED',
      next_follow_up_at: tomorrowAt1030.toISOString(),
      last_contacted_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      agency_id: AGENCY_ID, property_id: 'c0000000-0000-0000-0000-000000000002',
      assigned_to: nadiaId,
      name: 'Sara Amrani', phone: '+212662234502', email: 'sara.amrani@gmail.com',
      budget_min: 2000000, budget_max: 3000000,
      city: 'Marrakech', property_type: 'villa', transaction_type: 'sale',
      timeline: 'immediate', source: 'instagram', status: 'VISIT_SCHEDULED',
      last_contacted_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      agency_id: AGENCY_ID, property_id: 'c0000000-0000-0000-0000-000000000003',
      assigned_to: mehdiId,
      name: 'Youssef Alaoui', phone: '+212663234503',
      budget_min: 600000, budget_max: 900000,
      city: 'Rabat', property_type: 'studio', transaction_type: 'sale',
      timeline: '1-3months', source: 'google', status: 'CONTACTED',
      next_follow_up_at: todayAt14.toISOString(),
      last_contacted_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000004',
      agency_id: AGENCY_ID, property_id: 'c0000000-0000-0000-0000-000000000004',
      name: 'Fatima Zahrae', phone: '+212664234504', email: 'fatima.z@gmail.com',
      budget_min: 1500000, budget_max: 2500000,
      city: 'Marrakech', property_type: 'riad', transaction_type: 'sale',
      timeline: '3-6months', source: 'website', status: 'NEW',
    },
    {
      id: 'd0000000-0000-0000-0000-000000000005',
      agency_id: AGENCY_ID, property_id: 'c0000000-0000-0000-0000-000000000005',
      assigned_to: mehdiId,
      name: 'Karim Idrissi', phone: '+212665234505', email: 'karim.id@outlook.com',
      budget_min: 2800000, budget_max: 3500000,
      city: 'Casablanca', property_type: 'apartment', transaction_type: 'sale',
      timeline: 'immediate', source: 'referral', status: 'NEGOTIATION',
      next_follow_up_at: todayAt11.toISOString(),
      last_contacted_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'd0000000-0000-0000-0000-000000000006',
      agency_id: AGENCY_ID, property_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_to: nadiaId,
      name: 'Amina Berrada', phone: '+212666234506', email: 'amina.b@gmail.com',
      budget_min: 500000, budget_max: 700000,
      city: 'Marrakech', property_type: 'apartment', transaction_type: 'sale',
      timeline: '1-3months', source: 'facebook', status: 'LOST',
      lost_reason: 'budget_mismatch',
      last_contacted_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const { error: leadErr } = await supabase.from('leads').upsert(leads, { onConflict: 'id' })
  if (leadErr) log('❌', `Leads: ${leadErr.message}`)
  else log('✅', `${leads.length} leads seeded`)

  // ────────────────────────────────────────
  // 5. SEED VISITS
  // ────────────────────────────────────────
  log('\n📅', 'Seeding visits...')

  const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

  const visits = [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      lead_id: 'd0000000-0000-0000-0000-000000000002',
      property_id: 'c0000000-0000-0000-0000-000000000002',
      agent_id: nadiaId, agency_id: AGENCY_ID,
      visit_date: dayAfterTomorrow.toISOString().split('T')[0],
      visit_time: '10:00', status: 'SCHEDULED',
      notes: 'La cliente veut voir la piscine et le jardin en priorité.',
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      lead_id: 'd0000000-0000-0000-0000-000000000005',
      property_id: 'c0000000-0000-0000-0000-000000000005',
      agent_id: mehdiId, agency_id: AGENCY_ID,
      visit_date: tomorrow.toISOString().split('T')[0],
      visit_time: '15:30', status: 'SCHEDULED',
      notes: 'Client très motivé, préparer les documents du bien.',
    },
  ]

  const { error: visitErr } = await supabase.from('visits').upsert(visits, { onConflict: 'id' })
  if (visitErr) log('❌', `Visits: ${visitErr.message}`)
  else log('✅', `${visits.length} visits seeded`)

  // ────────────────────────────────────────
  // 6. SEED NOTES
  // ────────────────────────────────────────
  log('\n📝', 'Seeding notes...')

  const notes = [
    { lead_id: 'd0000000-0000-0000-0000-000000000001', author_id: mehdiId, content: 'Client très intéressé par le T3 Guéliz. Budget correct. À relancer demain pour fixer une visite.' },
    { lead_id: 'd0000000-0000-0000-0000-000000000002', author_id: nadiaId, content: 'Visite programmée samedi matin. La cliente vient avec son mari.' },
    { lead_id: 'd0000000-0000-0000-0000-000000000005', author_id: mehdiId, content: 'Négociation en cours. Le client propose 3M DH, propriétaire demande 3.2M. En attente de contre-offre.' },
  ]

  const { error: noteErr } = await supabase.from('lead_notes').insert(notes)
  if (noteErr) log('❌', `Notes: ${noteErr.message}`)
  else log('✅', `${notes.length} notes seeded`)

  // ────────────────────────────────────────
  // 7. SEED ACTIVITIES
  // ────────────────────────────────────────
  log('\n📊', 'Seeding activities...')

  const activities = [
    { lead_id: 'd0000000-0000-0000-0000-000000000001', action: 'lead_created', details: 'Lead créé via formulaire Facebook' },
    { lead_id: 'd0000000-0000-0000-0000-000000000001', user_id: omarId, action: 'agent_assigned', details: 'Assigné à Mehdi Bennis' },
    { lead_id: 'd0000000-0000-0000-0000-000000000001', user_id: mehdiId, action: 'status_changed', details: 'NEW → CONTACTED' },
    { lead_id: 'd0000000-0000-0000-0000-000000000001', user_id: mehdiId, action: 'status_changed', details: 'CONTACTED → QUALIFIED' },
    { lead_id: 'd0000000-0000-0000-0000-000000000001', user_id: mehdiId, action: 'follow_up_scheduled', details: 'Relance prévue demain 10h30' },
    { lead_id: 'd0000000-0000-0000-0000-000000000002', action: 'lead_created', details: 'Lead créé via formulaire Instagram' },
    { lead_id: 'd0000000-0000-0000-0000-000000000002', user_id: nadiaId, action: 'visit_scheduled', details: 'Visite de la villa samedi 10h' },
    { lead_id: 'd0000000-0000-0000-0000-000000000003', action: 'lead_created', details: 'Lead créé via Google Ads' },
    { lead_id: 'd0000000-0000-0000-0000-000000000004', action: 'lead_created', details: 'Lead créé via le site web' },
    { lead_id: 'd0000000-0000-0000-0000-000000000005', action: 'lead_created', details: 'Lead créé via recommandation' },
    { lead_id: 'd0000000-0000-0000-0000-000000000005', user_id: mehdiId, action: 'status_changed', details: 'QUALIFIED → NEGOTIATION' },
    { lead_id: 'd0000000-0000-0000-0000-000000000006', action: 'lead_created', details: 'Lead créé via Facebook' },
    { lead_id: 'd0000000-0000-0000-0000-000000000006', user_id: nadiaId, action: 'status_changed', details: 'CONTACTED → LOST (budget_mismatch)' },
  ]

  const { error: actErr } = await supabase.from('lead_activities').insert(activities)
  if (actErr) log('❌', `Activities: ${actErr.message}`)
  else log('✅', `${activities.length} activities seeded`)

  // ────────────────────────────────────────
  // DONE
  // ────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════╗')
  console.log('║          ✅ Seed Complete!            ║')
  console.log('╚══════════════════════════════════════╝')
  console.log(`\n🔑 Demo Login Credentials:`)
  console.log(`   Admin:  omar@immomaroc.ma  / ${PASSWORD}`)
  console.log(`   Agent:  mehdi@immomaroc.ma / ${PASSWORD}`)
  console.log(`   Agent:  nadia@immomaroc.ma / ${PASSWORD}`)
  console.log(`\n🌐 Open: http://localhost:3000/login\n`)
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message)
  process.exit(1)
})
