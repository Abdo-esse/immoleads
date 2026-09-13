import type { Property, Lead } from '@/types'

// ═══════════════════════════════════════════
// Property Matching Engine — Multi-Criteria Scoring
// ═══════════════════════════════════════════

/**
 * Weight configuration for each matching criterion.
 * Sum should equal 1.0 for normalized scoring.
 */
const WEIGHTS = {
  city: 0.35,
  budget: 0.40,
  propertyType: 0.25,
} as const

/** How much tolerance (±%) we allow on the budget range. */
const BUDGET_TOLERANCE = 0.15

export interface MatchResult {
  property: Property
  score: number        // 0-100
  breakdown: {
    city: number       // 0-100
    budget: number     // 0-100
    propertyType: number // 0-100
  }
}

/**
 * Calculate a match score (0–100) between a lead and a property.
 */
export function calculateMatchScore(
  lead: Pick<Lead, 'city' | 'budget_min' | 'budget_max' | 'property_type'>,
  property: Pick<Property, 'city' | 'district' | 'price' | 'type' | 'status'>
): { score: number; breakdown: MatchResult['breakdown'] } {
  // ── City match ──────────────────────────────
  let cityScore = 0
  if (lead.city && property.city) {
    const leadCity = lead.city.toLowerCase().trim()
    const propCity = property.city.toLowerCase().trim()
    const propDistrict = property.district?.toLowerCase().trim() || ''

    if (leadCity === propCity) {
      cityScore = 100
    } else if (propCity.includes(leadCity) || leadCity.includes(propCity)) {
      cityScore = 80
    } else if (propDistrict && (propDistrict.includes(leadCity) || leadCity.includes(propDistrict))) {
      cityScore = 60
    }
  } else if (!lead.city) {
    // No city preference → neutral match
    cityScore = 50
  }

  // ── Budget match ────────────────────────────
  let budgetScore = 0
  const price = property.price
  const budgetMin = lead.budget_min
  const budgetMax = lead.budget_max

  if (budgetMin || budgetMax) {
    const effectiveMin = budgetMin ? budgetMin * (1 - BUDGET_TOLERANCE) : 0
    const effectiveMax = budgetMax ? budgetMax * (1 + BUDGET_TOLERANCE) : Infinity

    if (price >= effectiveMin && price <= effectiveMax) {
      // Perfect match within tolerance — compute how centered the price is
      if (budgetMin && budgetMax) {
        const midPoint = (budgetMin + budgetMax) / 2
        const range = budgetMax - budgetMin
        if (range > 0) {
          const deviation = Math.abs(price - midPoint) / range
          budgetScore = Math.max(0, Math.round(100 - deviation * 60))
        } else {
          budgetScore = price === budgetMin ? 100 : 70
        }
      } else {
        budgetScore = 80
      }
    } else {
      // Price is outside tolerance — penalize based on distance
      const dist = price < effectiveMin
        ? (effectiveMin - price) / (effectiveMin || 1)
        : (price - effectiveMax) / (effectiveMax || 1)

      budgetScore = Math.max(0, Math.round(40 - dist * 100))
    }
  } else {
    // No budget specified → neutral
    budgetScore = 50
  }

  // ── Property type match ─────────────────────
  let typeScore = 0
  if (lead.property_type && property.type) {
    const leadType = lead.property_type.toLowerCase().trim()
    const propType = property.type.toLowerCase().trim()

    if (leadType === propType) {
      typeScore = 100
    } else {
      // Partial match for related types
      const relatedGroups: string[][] = [
        ['apartment', 'studio'],
        ['villa', 'riad'],
      ]
      const areRelated = relatedGroups.some(
        (group) => group.includes(leadType) && group.includes(propType)
      )
      typeScore = areRelated ? 50 : 0
    }
  } else if (!lead.property_type) {
    typeScore = 50
  }

  // ── Weighted aggregate ──────────────────────
  const score = Math.round(
    cityScore * WEIGHTS.city +
    budgetScore * WEIGHTS.budget +
    typeScore * WEIGHTS.propertyType
  )

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: {
      city: cityScore,
      budget: budgetScore,
      propertyType: typeScore,
    },
  }
}

/**
 * Rank all properties against a lead's criteria.
 * Returns only active properties with score > minScore, sorted desc.
 */
export function rankProperties(
  lead: Pick<Lead, 'city' | 'budget_min' | 'budget_max' | 'property_type'>,
  properties: Property[],
  minScore = 30,
  limit = 10
): MatchResult[] {
  return properties
    .filter((p) => p.status === 'active')
    .map((property) => {
      const { score, breakdown } = calculateMatchScore(lead, property)
      return { property, score, breakdown }
    })
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Utility: format match score into a human-readable label.
 */
export function getMatchLabel(score: number): {
  label: string
  emoji: string
  colorClass: string
} {
  if (score >= 85)
    return { label: 'Excellent', emoji: '🎯', colorClass: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/30' }
  if (score >= 65)
    return { label: 'Bon', emoji: '✅', colorClass: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30' }
  if (score >= 45)
    return { label: 'Moyen', emoji: '🔶', colorClass: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/30' }
  return { label: 'Faible', emoji: '⚪', colorClass: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800' }
}
