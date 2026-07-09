'use client'

import { Shield, Users, Heart, Headphones } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { getContentSection } from '@/lib/utils'

const ICON_MAP: Record<string, any> = {
  shield: Shield,
  users: Users,
  heart: Heart,
  headphones: Headphones,
}

export default function WhyChooseUs() {
  const { data } = useTenant()
  const section = getContentSection(data?.content || [], 'WhyChooseUs')
  const items = data?.whyChooseUs || []

  if (items.length === 0) return null

  return (
    <section id="why-us" style={{ background: 'var(--navy)', padding: '96px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>
            {section?.badgeText || 'Why Choose Us'}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '1rem',
          }}>
            {section?.title || 'Your Trusted Travel Partner'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '36rem', margin: '0 auto' }}>
            {section?.subtitle || 'Experience the difference with our professional team and exceptional service'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
        }}>
          {items.map((item) => {
            const Icon = ICON_MAP[item.iconName?.toLowerCase() || ''] || Shield
            return (
              <div key={item.id} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <Icon size={32} color="var(--gold)" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-sans)' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
