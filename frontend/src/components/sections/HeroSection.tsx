'use client'

import { useEffect, useState } from 'react'
import { PlayCircle } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'
import { getContentSection } from '@/lib/utils'

export default function HeroSection() {
  const { data, tenant } = useTenant()
  const hero = getContentSection(data?.content || [], 'Hero')
  const stats = data?.stats || []
  const galleryPreview = data?.gallery?.slice(0, 3) || []
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const bgImage = hero?.imageUrl

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={
          bgImage
            ? { backgroundImage: `url(${bgImage})` }
            : { background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }
        }
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="container relative z-10 pb-20 pt-32">
        <div className="max-w-3xl">
          {hero?.badgeText && (
            <div
              className="section-label-left mb-6"
              style={{ color: 'var(--gold)', opacity: mounted ? 1 : 0, transition: 'opacity 0.7s ease' }}
            >
              {hero.badgeText}
            </div>
          )}

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.08,
              marginBottom: '1.5rem',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
            }}
          >
            {hero?.title || 'Your Sacred Himalayan Adventure Starts Here'}
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '2.5rem',
              maxWidth: '520px',
              lineHeight: 1.7,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
            }}
          >
            {hero?.subtitle ||
              'Embark on a spiritual odyssey through the sacred Himalayas. Discover mystical beauty and timeless tradition.'}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '4rem',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.7s ease 0.3s',
            }}
          >
            <a href={tenantUrl(tenant?.subdomain, hero?.ctaUrl || '/tours')} className="btn-gold">
              {hero?.ctaText || 'Explore Now'}
            </a>
            <a href={hero?.secondaryCtaUrl || '#'} className="btn-outline">
              <PlayCircle size={18} />
              {hero?.secondaryCtaText || 'Watch Video'}
            </a>
          </div>

          {stats.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2.5rem',
                opacity: mounted ? 1 : 0,
                transition: 'opacity 0.7s ease 0.4s',
              }}
            >
              {stats.map((stat) => (
                <div key={stat.id}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {galleryPreview.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', position: 'absolute', bottom: '5rem', right: '3rem', zIndex: 10 }}
          className="hidden lg:flex">
          {galleryPreview.map((item, i) => (
            <div
              key={item.id}
              style={{
                width: '8rem',
                height: '11rem',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.7s ease ${0.3 + i * 0.1}s`,
              }}
            >
              <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
