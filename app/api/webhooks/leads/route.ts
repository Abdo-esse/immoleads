import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createNotification } from '@/lib/actions/notifications'
import { autoAssignLead } from '@/lib/actions/assignment'

const WEBHOOK_SECRET = process.env.LEADS_WEBHOOK_SECRET || 'immoleads_secret_webhook_key'

/**
 * GET /api/webhooks/leads
 * Provides simple API documentation and health status for external integrations.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/webhooks/leads',
    description: 'ImmoLeads external lead ingestion webhook (Facebook Ads, Google Ads, Avito, Mubawab)',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': '<optional_secret_token>',
    },
    payload_example: {
      name: 'Karim Alaoui',
      phone: '+212661234567',
      email: 'karim@example.com',
      city: 'Casablanca',
      budget: 1800000,
      source: 'FACEBOOK_ADS', // FACEBOOK_ADS | GOOGLE_ADS | AVITO | MUBAWAB | WEBSITE | OTHER
      notes: 'Intéressé par un appartement 3 pièces à Maarif',
      agency_id: '<optional_agency_uuid>',
    },
  })
}

/**
 * POST /api/webhooks/leads
 * Ingests external leads directly into the CRM database.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Check optional secret token if configured
    const incomingSecret = req.headers.get('x-webhook-secret') || req.nextUrl.searchParams.get('token')
    if (process.env.LEADS_WEBHOOK_SECRET && incomingSecret !== process.env.LEADS_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Accès non autorisé: token secret invalide' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Payload JSON invalide ou manquant' },
        { status: 400 }
      )
    }

    const { name, phone, email, city, budget, source, notes, agency_id, property_id } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le champ "name" est obligatoire' },
        { status: 400 }
      )
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le champ "phone" est obligatoire' },
        { status: 400 }
      )
    }

    // 3. Resolve target agency_id
    let resolvedAgencyId = agency_id
    if (!resolvedAgencyId) {
      const { data: agency, error: agencyError } = await supabaseAdmin
        .from('agencies')
        .select('id')
        .limit(1)
        .single()

      if (agencyError || !agency) {
        return NextResponse.json(
          { error: 'Aucune agence trouvée pour associer le lead' },
          { status: 500 }
        )
      }
      resolvedAgencyId = agency.id
    }

    // Format and normalize source
    const rawSource = (source || 'FACEBOOK_ADS').toString().trim().toUpperCase()
    const validSources = ['WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'AVITO', 'MUBAWAB', 'REFERRAL', 'OTHER']
    const normalizedSource = validSources.includes(rawSource) ? rawSource : 'OTHER'

    // Parse budget if provided
    let parsedBudget: number | null = null
    if (budget !== undefined && budget !== null && budget !== '') {
      const num = Number(budget)
      if (!isNaN(num)) parsedBudget = num
    }

    // 4. Insert lead using admin client
    const { data: lead, error: insertError } = await supabaseAdmin
      .from('leads')
      .insert({
        agency_id: resolvedAgencyId,
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        city: city ? city.trim() : null,
        budget: parsedBudget,
        source: normalizedSource,
        notes: notes ? notes.trim() : null,
        status: 'NEW',
        property_id: property_id || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('[Webhook Ingestion Error]:', insertError)
      return NextResponse.json(
        { error: `Erreur lors de l'insertion du lead: ${insertError.message}` },
        { status: 500 }
      )
    }

    // 5. Log activity
    await supabaseAdmin.from('lead_activities').insert({
      lead_id: lead.id,
      action: 'lead_created',
      details: `Lead reçu via Webhook externe (${normalizedSource})`,
    })

    // 6. Auto-assign lead via Round-Robin
    try {
      await autoAssignLead(
        lead.id,
        resolvedAgencyId,
        name.trim(),
        phone.trim(),
        city ? city.trim() : null
      )
    } catch (rrErr) {
      console.warn('[Webhook Round-Robin Error]:', rrErr)
    }

    // 7. Create Realtime notification for the agency
    try {
      await createNotification({
        agencyId: resolvedAgencyId,
        title: `Nouveau lead (${normalizedSource})`,
        message: `${name.trim()} (${phone.trim()})${city ? ` - ${city.trim()}` : ''}`,
        type: 'lead_created',
        link: `/dashboard/leads/${lead.id}`,
      })
    } catch (notifErr) {
      console.error('[Webhook Notification Error]:', notifErr)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead ingéré avec succès',
        lead: {
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          source: lead.source,
          agency_id: resolvedAgencyId,
        },
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('[Webhook Catch Error]:', err)
    return NextResponse.json(
      { error: err?.message || 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
