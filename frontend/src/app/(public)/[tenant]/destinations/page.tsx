'use client'

import { useTenant } from '@/context/TenantContext'
import { useParams } from 'next/navigation'
import { tenantUrl } from '@/lib/utils'

const DESTINATIONS = [
  { name: 'Mount Kailash', country: 'Tibet', description: 'Sacred mountain revered by four religions', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070' },
  { name: 'Kathmandu', country: 'Nepal', description: 'The gateway city to the Himalayas', image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=2070' },
  { name: 'Everest Base Camp', country: 'Nepal', description: 'Journey to the foot of the world\'s highest peak', image: 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=2070' },
  { name: 'Lhasa', country: 'Tibet', description: 'The spiritual heart of Tibetan Buddhism', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070' },
  { name: 'Pokhara', country: 'Nepal', description: 'Serene lakeside city with Annapurna views', image: 'https://images.unsplash.com/photo-1582650949431-a0e1dbc24c4c?q=80&w=2070' },
  { name: 'Lake Mansarovar', country: 'Tibet', description: 'Sacred lake at 4,590m altitude', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070' },
]

export default function DestinationsPage() {
  const params = useParams()
  const tenantSlug = params.tenant as string
  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Explore</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Our Destinations
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Explore the sacred and breathtaking destinations of the Himalayas
          </p>
        </div>
      </div>

      <section style={{ padding: '96px 0', background: '#FAF9F6' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {DESTINATIONS.map((dest) => (
              <a key={dest.name} href={tenantUrl(tenantSlug, '/tours')} className="tour-card" style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="tour-card-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                    <div style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '2px' }}>{dest.country}</div>
                    <h3 style={{ color: '#ffffff', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>{dest.name}</h3>
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.6 }}>{dest.description}</p>
                  <div style={{ marginTop: '1rem', color: 'var(--gold)', fontWeight: 600, fontSize: '0.875rem' }}>
                    View Tours →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
