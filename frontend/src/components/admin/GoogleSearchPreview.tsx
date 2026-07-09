'use client'

import { getSubdomain } from '@/lib/utils'

interface GoogleSearchPreviewProps {
  seoTitle: string
  seoDescription: string
  slug: string
  fallbackTitle?: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default function GoogleSearchPreview({
  seoTitle,
  seoDescription,
  slug,
  fallbackTitle = '',
}: GoogleSearchPreviewProps) {
  const displayTitle = seoTitle || fallbackTitle || 'Untitled Tour'
  const displayDescription =
    seoDescription || 'Add an SEO description to control how this tour appears in search results.'

  const subdomain = getSubdomain()
  const cleanUrl = SITE_URL.replace(/^https?:\/\//, '')
  const displayUrl = `${subdomain}.${cleanUrl}/tours/${slug || 'tour-slug'}`

  return (
    <div
      style={{
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '1.25rem',
        background: '#fff',
      }}
    >
      <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.75rem', fontWeight: 500 }}>
        Google search Preview
      </div>

      <div
        style={{
          fontSize: '1.15rem',
          lineHeight: 1.3,
          color: '#1a0dab',
          marginBottom: '0.35rem',
          fontFamily: 'arial, sans-serif',
          wordBreak: 'break-word',
        }}
      >
        {displayTitle}
      </div>

      <div
        style={{
          fontSize: '0.85rem',
          color: '#006621',
          marginBottom: '0.4rem',
          fontFamily: 'arial, sans-serif',
          wordBreak: 'break-word',
        }}
      >
        {displayUrl}
      </div>

      <div
        style={{
          fontSize: '0.85rem',
          color: '#545454',
          lineHeight: 1.4,
          fontFamily: 'arial, sans-serif',
        }}
      >
        {displayDescription}
      </div>
    </div>
  )
}
