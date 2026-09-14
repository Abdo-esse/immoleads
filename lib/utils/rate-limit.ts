import { headers } from 'next/headers'

interface RateLimitRecord {
  timestamps: number[]
}

// In-memory store for rate limiting (survives across requests in the Node.js process)
const rateLimitStore = new Map<string, RateLimitRecord>()

// Cleanup stale records every 5 minutes to avoid memory buildup
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now

  const cutoff = now - windowMs
  for (const [key, record] of rateLimitStore.entries()) {
    const valid = record.timestamps.filter((t) => t > cutoff)
    if (valid.length === 0) {
      rateLimitStore.delete(key)
    } else {
      record.timestamps = valid
    }
  }
}

/**
 * Check if a given identifier (IP or user ID) is within the allowed rate limit.
 *
 * @param key Unique key for the subject (e.g. `lead_submission_${ip}`)
 * @param maxRequests Maximum allowed requests within the window (default: 5)
 * @param windowMs Time window in milliseconds (default: 60,000 ms = 1 minute)
 */
export function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  cleanup(windowMs)

  const now = Date.now()
  const cutoff = now - windowMs

  const record = rateLimitStore.get(key) || { timestamps: [] }
  // Keep only timestamps within the current sliding window
  const activeTimestamps = record.timestamps.filter((t) => t > cutoff)

  if (activeTimestamps.length >= maxRequests) {
    const oldest = activeTimestamps[0]
    const retryAfterMs = oldest + windowMs - now
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(Math.max(1, retryAfterMs / 1000)),
    }
  }

  // Record this request
  activeTimestamps.push(now)
  rateLimitStore.set(key, { timestamps: activeTimestamps })

  return {
    allowed: true,
    remaining: maxRequests - activeTimestamps.length,
    retryAfterSeconds: 0,
  }
}

/**
 * Extract client IP from request headers (Next.js server-side).
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers()
    const forwarded = headerList.get('x-forwarded-for')
    if (forwarded) {
      // Return first IP in list (client IP)
      return forwarded.split(',')[0].trim()
    }
    const realIp = headerList.get('x-real-ip')
    if (realIp) return realIp.trim()
  } catch {
    // Fallback if called outside request context
  }
  return '127.0.0.1'
}
