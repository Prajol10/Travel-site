'use client'

import { Check, Calendar } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'
import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/lib/utils'

export default function FeaturedJourney() {
  const { data, tenant } = useTenant()
  const { currency } = useCurrency()
  const featured = data?.tours?.find((t) => t.isFeatured) || data?.tours?.[0]

  if (!featured) return null

  const highlights = [
    { title: 'Expert Guidance', desc: 'Professional guides with decades of regional experience' },
    { title: 'Full Support', desc: 'Complete medical and logistical support throughout' },
    { title: 'Authentic Experience', desc: 'Connect deeply with culture, nature, and tradition' },
  ]

  return (
    <section style={{ padding: '96px 0', background: '#ffffff' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '6fr 5fr', gap: '4rem', alignItems: 'center' }}>
          {/* Text */}
          <div>
            <div className="section-label-left" style={{ marginBottom: '1.25rem' }}>Featured Journey</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem', lineHeight: 1.2 }}>
              {featured.title}
            </h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '1rem' }}>
              {featured.shortDescription || 'Journey to the spiritual heart of the mountains on this carefully curated adventure.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.25rem' }}>
              {highlights.map((h) => (
                <div key={h.title} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Check size={14} color="white" strokeWidth={3} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '2px' }}>{h.title}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
              <a href={tenantUrl(tenant?.subdomain, `/tours/${featured.slug}`)} className="btn-gold">View Full Itinerary</a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-500)', fontSize: '0.875rem', fontWeight: 500 }}>
                <Calendar size={15} color="var(--gold)" />
                {featured.durationDays} Days / {featured.durationNights} Nights
              </div>
            </div>
          </div>

          {/* Image */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '1.25rem', overflow: 'hidden', aspectRatio: '4/4.2', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              {featured.coverImageUrl ? (
                <img
                  src={featured.coverImageUrl}
                  alt={featured.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
              )}
            </div>

            {featured.rating && (
              <div style={{
                position: 'absolute', bottom: '1.5rem', left: '1.5rem',
                background: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>⭐</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1.1rem', lineHeight: 1 }}>{featured.rating}/5</div>
                  <div style={{ color: 'var(--gray-400)', fontSize: '0.75rem', marginTop: '3px' }}>{featured.reviewCount || 0} travelers</div>
                </div>
              </div>
            )}

            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--gold)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: '999px', boxShadow: '0 4px 15px rgba(201,168,76,0.4)' }}>
              Book Now
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
