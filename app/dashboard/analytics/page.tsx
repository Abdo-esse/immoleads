import { getAnalyticsData } from '@/lib/actions/dashboard'
import { getRevenueKPIs, getLeaderboard, getResponseTimes, getMonthlyGoals } from '@/lib/actions/performance'
import { AnalyticsClient } from './analytics-client'

export const metadata = { title: 'Analytics & Performance' }

export default async function AnalyticsPage() {
  const [
    { funnel, sources, trends, agents },
    revenue,
    leaderboard,
    responseTimes,
    goals,
  ] = await Promise.all([
    getAnalyticsData(),
    getRevenueKPIs(),
    getLeaderboard(),
    getResponseTimes(),
    getMonthlyGoals(),
  ])

  return (
    <AnalyticsClient
      funnel={funnel}
      sources={sources}
      trends={trends}
      agents={agents}
      revenue={revenue}
      leaderboard={leaderboard}
      responseTimes={responseTimes}
      goals={goals}
    />
  )
}
