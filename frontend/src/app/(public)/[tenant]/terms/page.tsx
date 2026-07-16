'use client'
import { useTenant } from '@/context/TenantContext'
import { getContentSection } from '@/lib/utils'

const FALLBACK_BODY = `
  <h2>Acceptance of Terms</h2>
  <p>By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.</p>
  <h2>Booking &amp; Payments</h2>
  <p>All bookings are subject to availability. A deposit is required to confirm your booking. Full payment must be received before the departure date as specified in your booking confirmation.</p>
  <h2>Cancellation Policy</h2>
  <p>Cancellations must be made in writing. Refunds are subject to our cancellation policy which varies depending on how far in advance the cancellation is made.</p>
  <h2>Liability</h2>
  <p>We are not liable for any indirect, incidental, or consequential damages arising from your use of our services or participation in our tours.</p>
`

export default function TermsPage() {
  const { data } = useTenant()
  const section = getContentSection(data?.content || [], 'TermsOfService')

  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            {section?.title || 'Terms of Service'}
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
