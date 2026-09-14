import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { triggerFollowUpReminders } from '@/lib/actions/follow-up-reminders'

/**
 * Cron endpoint: scans all agencies for overdue leads and sends notifications.
 * 
 * Can be called by:
 * - Vercel Cron (vercel.json cron schedule)
 * - External cron service (e.g. cron-job.org)
 * - Manual trigger via GET /api/cron/follow-ups?secret=xxx
 */
export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET

  if (!expectedSecret) {
    console.error('[Cron Security] CRON_SECRET is not configured on the server.')
    return NextResponse.json(
      { error: 'Server configuration error: CRON_SECRET is not set' },
      { status: 500 }
    )
  }

  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  const querySecret = request.nextUrl.searchParams.get('secret')
  const providedSecret = bearerToken || querySecret

  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all agencies
    const { data: agencies } = await supabaseAdmin
      .from('agencies')
      .select('id')

    if (!agencies || agencies.length === 0) {
      return NextResponse.json({ message: 'No agencies found', sent: 0 })
    }

    let totalSent = 0

    for (const agency of agencies) {
      const { sent } = await triggerFollowUpReminders(agency.id)
      totalSent += sent
    }

    return NextResponse.json({
      message: `Follow-up reminders processed`,
      agencies: agencies.length,
      notificationsSent: totalSent,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Cron follow-ups error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
