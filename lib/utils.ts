export { cn } from 'cn'
import { nanoid } from 'nanoid'

/**
 * Format a price in Moroccan Dirhams.
 * e.g. 1200000 → "1 200 000 DH"
 */
export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat('fr-MA').format(amount)} DH`
}

/**
 * Generate a URL-friendly slug from a title with a 4-char unique suffix.
 * e.g. "Appartement T3 - Guéliz" → "appartement-t3-gueliz-a82f"
 */
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // remove special chars
    .replace(/\s+/g, '-')            // spaces to hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .replace(/^-|-$/g, '')           // trim leading/trailing hyphens

  const suffix = nanoid(4)
  return `${base}-${suffix}`
}

/**
 * Format a Moroccan phone number for display.
 * e.g. "0661234567" → "+212 6 61 23 45 67"
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')

  // Already has country code
  if (digits.startsWith('212') && digits.length === 12) {
    const rest = digits.slice(3)
    return `+212 ${rest[0]} ${rest.slice(1, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)} ${rest.slice(7, 9)}`
  }

  // Local format starting with 0
  if (digits.startsWith('0') && digits.length === 10) {
    return `+212 ${digits[1]} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
  }

  // Return as-is if format is unknown
  return phone
}

/**
 * Normalize a Moroccan phone to +212 format for storage.
 * e.g. "06 61 23 45 67" → "+212661234567"
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')

  if (digits.startsWith('0') && digits.length === 10) {
    return `+212${digits.slice(1)}`
  }

  if (digits.startsWith('212') && digits.length === 12) {
    return `+${digits}`
  }

  if (digits.startsWith('+212')) {
    return digits
  }

  return phone
}

/**
 * Get initials from a full name.
 * e.g. "Ahmed Benali" → "AB"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Format relative time for activity feeds.
 * e.g. "2 hours ago", "Yesterday", "3 days ago"
 */
export function timeAgo(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 172800) return 'Yesterday'
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return then.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: then.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Get the base application URL dynamically.
 * Prioritizes NEXT_PUBLIC_APP_URL, VERCEL_URL, request headers, then localhost fallback.
 */
export async function getAppBaseUrl(): Promise<string> {
  // 1. Try request headers first (dynamically detects domain from current user request in production)
  try {
    const { headers } = await import('next/headers')
    const headersList = await headers()
    const host = headersList.get('x-forwarded-host') || headersList.get('host')
    const proto = headersList.get('x-forwarded-proto') || 'https'
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      return `${proto}://${host}`
    }
  } catch {
    // headers unavailable (e.g. background job or build time)
  }

  // 2. Explicit NEXT_PUBLIC_APP_URL (if not localhost)
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    let url = process.env.NEXT_PUBLIC_APP_URL.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    return url.replace(/\/$/, '')
  }

  // 3. Vercel deployment URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, '')}`
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }

  // 4. Fallback to NEXT_PUBLIC_APP_URL if set
  if (process.env.NEXT_PUBLIC_APP_URL) {
    let url = process.env.NEXT_PUBLIC_APP_URL.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`
    }
    return url.replace(/\/$/, '')
  }

  return 'https://immoleads-umber.vercel.app'
}

