'use client'

import { useTenant } from '@/context/TenantContext'
import { Star } from 'lucide-react'

export default function TestimonialsPage() {
  const { data } = useTenant()
  const testimonials = data?.testimonials || []

  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Testimonials</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            What Our Travelers Say
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
            Real experiences from our happy travelers
          </p>
        </div>
      </div>

      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container">
          {testimonials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-500)' }}>
              <p style={{ fontSize: '1.1rem' }}>No testimonials yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
              {testimonials.map((t) => (
                <div key={t.id} className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', gap: '2px', color: 'var(--gold)', marginBottom: '1rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.round(t.rating) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>"{t.reviewText}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)' }}>
                    <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', overflow: 'hidden', background: 'var(--gold-pale)', flexShrink: 0 }}>
                      {t.authorPhotoUrl ? (
                        <img src={t.authorPhotoUrl} alt={t.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--gold)' }}>
                          {t.authorName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.875rem' }}>{t.authorName}</div>
                      <div style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>{t.authorLocation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
