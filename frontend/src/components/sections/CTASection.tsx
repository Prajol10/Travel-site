'use client'

import { Phone } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'
import { getContentSection } from '@/lib/utils'

export default function CTASection() {
  const { data, tenant } = useTenant()
  const section = getContentSection(data?.content || [], 'CTA')

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--navy)', padding: '6.5rem 0 5.5rem' }}
    >
      <div className="container relative z-10 text-center">
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '1.25rem',
            lineHeight: 1.2,
          }}
        >
          {section?.title || 'Ready for Your Next Adventure?'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '36rem', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
          {section?.subtitle || 'Let us craft the perfect journey for you. Contact our expert team today.'}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <a href={tenantUrl(tenant?.subdomain, section?.ctaUrl || '/contact')} className="btn-gold">
            {section?.ctaText || 'Plan Your Journey'}
          </a>
          {tenant?.phoneNumber && (
            <a href={`tel:${tenant.phoneNumber}`} className="btn-outline">
              <Phone size={16} />
              {section?.secondaryCtaText || 'Call Us Now'}
            </a>
          )}
        </div>

        {tenant?.phoneNumber && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
            <Phone size={16} color="var(--gold)" />
            {tenant.phoneNumber}
          </div>
        )}
      </div>
    </section>
  )
}
