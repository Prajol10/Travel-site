'use client'
import { Shield, Users, Heart, Headphones } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'
import { getContentSection } from '@/lib/utils'

const ICON_MAP: Record<string, any> = {
  shield: Shield,
  users: Users,
  heart: Heart,
  headphones: Headphones,
}

export default function WhyChooseUs() {
  const { data, tenant } = useTenant()
  const section = getContentSection(data?.content || [], 'WhyChooseUs')
  const items = data?.whyChooseUs || []
  if (items.length === 0) return null

  return (
    <section id="why-us" style={{ background: '#FAF9F6', padding: '64px 0 96px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--navy)',
            marginBottom: '1.25rem',
          }}>
            {section?.title || 'Why Choose Us'}
          </h2>
          <p style={{ color: 'var(--gray-500)', maxWidth: '40rem', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {section?.subtitle || 'Experience the difference with our professional team and exceptional service'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3rem 2.5rem',
          marginBottom: section?.ctaText ? '3.5rem' : 0,
        }}>
          {items.map((item) => {
            const Icon = ICON_MAP[item.iconName?.toLowerCase() || ''] || Shield
            return (
              <div key={item.id} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon size={44} color="var(--navy)" strokeWidth={1.25} />
                </div>
                <h3 style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1.25rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '20rem', margin: '0 auto' }}>
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {section?.ctaText && (
          <div style={{ textAlign: 'center' }}>
            <a href={tenantUrl(tenant?.subdomain, section?.ctaUrl || '/about')} className="btn-outline-gold">
              {section.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
