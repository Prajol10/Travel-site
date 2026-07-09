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
