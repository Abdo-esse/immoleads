'use client'

import jsPDF from 'jspdf'
import type { RevenueKPIs, LeaderboardEntry, MonthlyGoals } from '@/lib/actions/performance'

interface ReportData {
  agencyName: string
  month: string
  revenue: RevenueKPIs
  leaderboard: LeaderboardEntry[]
  goals: MonthlyGoals
  funnel: { status: string; count: number }[]
  sources: { source: string; leadCount: number; qualifiedCount: number }[]
}

function formatPrice(val: number): string {
  return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(val)
}

/**
 * Generate a monthly performance PDF report.
 */
export function generateMonthlyReport(data: ReportData) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // ═══ Header ═══
  doc.setFillColor(30, 30, 50)
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('ImmoLeads', margin, 18)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Rapport de Performance Mensuel`, margin, 26)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(data.month, pageWidth - margin, 18, { align: 'right' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(data.agencyName, pageWidth - margin, 26, { align: 'right' })

  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, 33, { align: 'right' })

  y = 50

  // ═══ KPIs Section ═══
  doc.setTextColor(30, 30, 50)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Performance Commerciale', margin, y)
  y += 8

  // KPI boxes
  const kpiBoxWidth = (contentWidth - 9) / 4
  const kpis = [
    { label: 'Chiffre d\'Affaires', value: `${formatPrice(data.revenue.totalRevenue)} MAD` },
    { label: 'Commission Agence', value: `${formatPrice(data.revenue.agencyCommission)} MAD` },
    { label: 'Deals Conclus', value: String(data.revenue.dealsWon) },
    { label: 'Ticket Moyen', value: `${formatPrice(data.revenue.avgDealSize)} MAD` },
  ]

  kpis.forEach((kpi, i) => {
    const x = margin + i * (kpiBoxWidth + 3)
    doc.setFillColor(245, 245, 250)
    doc.roundedRect(x, y, kpiBoxWidth, 22, 2, 2, 'F')

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 140)
    doc.text(kpi.label, x + 4, y + 7)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 50)
    doc.text(kpi.value, x + 4, y + 16)
  })

  y += 30

  // ═══ Monthly Goals ═══
  if (data.goals.leadGoal > 0 || data.goals.wonGoal > 0 || data.goals.revenueGoal > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 50)
    doc.text('Objectifs Mensuels', margin, y)
    y += 8

    const goals = [
      { label: 'Leads Qualifiés', current: data.goals.leadCurrent, goal: data.goals.leadGoal },
      { label: 'Ventes (WON)', current: data.goals.wonCurrent, goal: data.goals.wonGoal },
      { label: 'CA (MAD)', current: data.goals.revenueCurrent, goal: data.goals.revenueGoal },
    ].filter((g) => g.goal > 0)

    goals.forEach((g) => {
      const pct = g.goal > 0 ? Math.min(100, Math.round((g.current / g.goal) * 100)) : 0

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 100)
      doc.text(`${g.label}: ${g.current} / ${g.goal} (${pct}%)`, margin, y)

      // Progress bar
      doc.setFillColor(230, 230, 240)
      doc.roundedRect(margin, y + 2, contentWidth, 4, 1, 1, 'F')

      const barColor = pct >= 100 ? [16, 185, 129] : pct >= 50 ? [99, 102, 241] : [245, 158, 11]
      doc.setFillColor(barColor[0], barColor[1], barColor[2])
      doc.roundedRect(margin, y + 2, (contentWidth * pct) / 100, 4, 1, 1, 'F')

      y += 12
    })

    y += 4
  }

  // ═══ Leaderboard ═══
  if (data.leaderboard.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 50)
    doc.text('Classement des Agents', margin, y)
    y += 8

    // Table header
    doc.setFillColor(240, 240, 248)
    doc.rect(margin, y, contentWidth, 7, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(80, 80, 100)

    const cols = [margin + 3, margin + 12, margin + 60, margin + 85, margin + 110, margin + 140]
    doc.text('#', cols[0], y + 5)
    doc.text('Agent', cols[1], y + 5)
    doc.text('Deals', cols[2], y + 5)
    doc.text('CA (MAD)', cols[3], y + 5)
    doc.text('Conversion', cols[4], y + 5)
    doc.text('Réactivité', cols[5], y + 5)
    y += 9

    // Table rows
    doc.setFont('helvetica', 'normal')
    data.leaderboard.slice(0, 10).forEach((agent) => {
      const medal = agent.rank <= 3 ? ['🥇', '🥈', '🥉'][agent.rank - 1] : String(agent.rank)

      doc.setTextColor(30, 30, 50)
      doc.setFontSize(8)
      doc.text(medal, cols[0], y + 4)
      doc.text(agent.name.length > 20 ? agent.name.slice(0, 20) + '...' : agent.name, cols[1], y + 4)
      doc.text(String(agent.dealsWon), cols[2], y + 4)
      doc.text(formatPrice(agent.revenue), cols[3], y + 4)
      doc.text(`${agent.conversionRate}%`, cols[4], y + 4)
      doc.text(
        agent.avgResponseMinutes != null
          ? agent.avgResponseMinutes < 60
            ? `${agent.avgResponseMinutes}min`
            : `${Math.round(agent.avgResponseMinutes / 60)}h`
          : '—',
        cols[5],
        y + 4,
      )

      // Row separator
      doc.setDrawColor(230, 230, 240)
      doc.line(margin, y + 7, margin + contentWidth, y + 7)
      y += 9
    })

    y += 4
  }

  // ═══ Pipeline Funnel ═══
  if (data.funnel.length > 0) {
    // Check if we need a new page
    if (y > 230) {
      doc.addPage()
      y = margin
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 50)
    doc.text('Pipeline de Conversion', margin, y)
    y += 8

    const totalLeads = data.funnel.reduce((s, f) => s + f.count, 0)
    const statusLabels: Record<string, string> = {
      NEW: 'Nouveau',
      CONTACTED: 'Contacté',
      QUALIFIED: 'Qualifié',
      VISIT_SCHEDULED: 'Visite planifiée',
      NEGOTIATION: 'Négociation',
      WON: 'Gagné',
      LOST: 'Perdu',
    }
    const barColors: Record<string, number[]> = {
      NEW: [59, 130, 246],
      CONTACTED: [234, 179, 8],
      QUALIFIED: [139, 92, 246],
      VISIT_SCHEDULED: [34, 197, 94],
      NEGOTIATION: [249, 115, 22],
      WON: [16, 185, 129],
      LOST: [239, 68, 68],
    }

    data.funnel.forEach((f) => {
      const pct = totalLeads > 0 ? (f.count / totalLeads) * 100 : 0

      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 100)
      doc.text(`${statusLabels[f.status] || f.status} (${f.count})`, margin, y + 4)

      // Bar
      doc.setFillColor(230, 230, 240)
      doc.roundedRect(margin + 55, y + 1, contentWidth - 55, 5, 1, 1, 'F')

      const color = barColors[f.status] || [148, 163, 184]
      doc.setFillColor(color[0], color[1], color[2])
      doc.roundedRect(margin + 55, y + 1, Math.max(2, ((contentWidth - 55) * pct) / 100), 5, 1, 1, 'F')

      y += 9
    })

    y += 4
  }

  // ═══ Sources ═══
  if (data.sources.length > 0) {
    if (y > 240) {
      doc.addPage()
      y = margin
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 50)
    doc.text('Sources des Leads', margin, y)
    y += 8

    data.sources.forEach((s) => {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 30, 50)
      doc.text(`${s.source}`, margin + 3, y + 4)
      doc.text(`${s.leadCount} leads`, margin + 60, y + 4)
      doc.text(`${s.qualifiedCount} qualifiés`, margin + 100, y + 4)

      doc.setDrawColor(230, 230, 240)
      doc.line(margin, y + 7, margin + contentWidth, y + 7)
      y += 9
    })
  }

  // ═══ Footer ═══
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 160, 180)
    doc.text(
      `ImmoLeads — Rapport confidentiel — Page ${i}/${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' },
    )
  }

  // Download
  const fileName = `rapport-immoleads-${data.month.replace(/\s+/g, '-').toLowerCase()}.pdf`
  doc.save(fileName)
}
