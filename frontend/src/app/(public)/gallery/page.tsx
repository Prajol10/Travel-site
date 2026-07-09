'use client'

import { useState } from 'react'
import { useTenant } from '@/context/TenantContext'

export default function GalleryPage() {
  const { data } = useTenant()
  const [tab, setTab] = useState<'Photo' | 'Video'>('Photo')
  const items = (data?.gallery || []).filter((g) => g.mediaType === tab)

  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Memories & Moments</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Photo & Video Gallery
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
            Real moments captured during incredible Himalayan journeys
          </p>
        </div>
      </div>

      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <button onClick={() => setTab('Photo')} className={tab === 'Photo' ? 'btn-gold' : 'btn-outline-gold'}>Photos</button>
            <button onClick={() => setTab('Video')} className={tab === 'Video' ? 'btn-gold' : 'btn-outline-gold'}>Videos</button>
          </div>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-500)' }}>
              <p>No {tab.toLowerCase()}s yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ borderRadius: '0.75rem', overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }}>
                  <img src={item.thumbnailUrl || item.url} alt={item.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
