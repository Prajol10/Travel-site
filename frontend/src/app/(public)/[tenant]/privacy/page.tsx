'use client'
import { useTenant } from '@/context/TenantContext'
import { getContentSection } from '@/lib/utils'

const FALLBACK_BODY = `
  <h2>Information We Collect</h2>
  <p>We collect information you provide directly to us, such as when you make an enquiry, book a tour, or contact us. This includes your name, email address, phone number, and travel preferences.</p>
  <h2>How We Use Your Information</h2>
  <p>We use the information we collect to process your bookings, communicate with you about your travel plans, send you relevant travel information and offers, and improve our services.</p>
  <h2>Data Security</h2>
  <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
  <h2>Contact Us</h2>
  <p>If you have any questions about this Privacy Policy, please contact us through our contact page.</p>
`

export default function PrivacyPage() {
  const { data } = useTenant()
  const section = getContentSection(data?.content || [], 'PrivacyPolicy')

  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            {section?.title || 'Privacy Policy'}
          </h1>
        </div>
      </div>
      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div
            className="tour-full-description"
            style={{ lineHeight: 1.8, color: 'var(--gray-600)', fontSize: '1rem' }}
            dangerouslySetInnerHTML={{ __html: section?.body || FALLBACK_BODY }}
          />
        </div>
      </section>
    </>
  )
}
