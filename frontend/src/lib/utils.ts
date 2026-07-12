import { type ClassValue, clsx } from 'clsx'
import { Currency } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatPrice(
  priceUSD: number,
  priceINR?: number,
  priceEUR?: number,
  currency: Currency = 'USD'
): string {
  switch (currency) {
    case 'INR':
      return priceINR
        ? `₹${priceINR.toLocaleString('en-IN')}`
        : `$${priceUSD.toLocaleString()}`
    case 'EUR':
      return priceEUR
        ? `€${priceEUR.toLocaleString()}`
        : `$${priceUSD.toLocaleString()}`
    default:
      return `$${priceUSD.toLocaleString()}`
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getContentSection(sections: any[], type: string) {
  return sections?.find((s) => s.sectionType === type)
}

export function parseJsonSafely<T>(json?: string, fallback: T = [] as unknown as T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function getSubdomain(): string {
  if (typeof window === 'undefined') return 'demo'
  const host = window.location.hostname
  const parts = host.split('.')
  if (parts.length >= 3) return parts[0]
  return 'demo'
}

/**
 * Builds a tenant-prefixed internal URL, e.g. tenantUrl('prajol', '/tours') -> '/prajol/tours'
 * Leaves external links (http, tel:, mailto:, #anchors) untouched.
 * Falls back to the raw path if no tenant slug is available yet.
 */
export function tenantUrl(tenantSlug: string | undefined | null, path: string): string {
  if (!path) return path
  if (path.startsWith('http') || path.startsWith('tel:') || path.startsWith('mailto:') || path.startsWith('#')) {
    return path
  }
  if (!tenantSlug) return path

  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/${tenantSlug}${cleanPath}`
}
