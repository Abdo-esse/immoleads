import type { NextConfig } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let supabaseHost = 'poosudvgxbnwajavmjsh.supabase.co'
let supabaseOrigin = 'https://poosudvgxbnwajavmjsh.supabase.co'

if (supabaseUrl) {
  try {
    const parsed = new URL(supabaseUrl)
    supabaseHost = parsed.hostname
    supabaseOrigin = parsed.origin
  } catch {}
}

const remotePatterns: Array<{
  protocol: 'https' | 'http'
  hostname: string
  pathname?: string
}> = [
  {
    protocol: 'https',
    hostname: supabaseHost,
    pathname: '/storage/v1/object/public/**',
  },
  {
    protocol: 'https',
    hostname: '*.supabase.co',
    pathname: '/storage/v1/object/public/**',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
]

// Content-Security-Policy tailored for Next.js 16 + Supabase
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.supabase.co ${supabaseOrigin} https://images.unsplash.com;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co ${supabaseOrigin} ${supabaseOrigin.replace(/^http/, 'ws')};
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim()

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default nextConfig
