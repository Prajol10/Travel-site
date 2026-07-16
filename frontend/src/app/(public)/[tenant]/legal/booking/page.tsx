'use client'
import { useTenant } from '@/context/TenantContext'
import { getContentSection } from '@/lib/utils'

const FALLBACK_BODY = `
  <h2>Reservation Process</h2>
  <p>To reserve your spot on any of our tours, submit an enquiry through our contact form or call us directly. Our team will confirm availability and provide you with a detailed booking form.</p>
  <h2>Deposit &amp; Payment</h2>
  <p>A 30% deposit is required to confirm your booking. The remaining balance is due 30 days before your departure date. We accept Visa, Mastercard, and bank transfers.</p>
  <h2>Cancellation &amp; Refunds</h2>
  <p>Cancellations made more than 60 days before departure: 90% refund. 30-60 days: 50% refund. Less than 30 days: no refund. We strongly recommend travel insurance.</p>
  <h2>Travel Insurance</h2>
  <p>We strongly recommend that all travelers purchase comprehensive travel insurance covering trip cancellation, medical emergencies, and evacuation.</p>
`

export default function BookingPolicyPage() {
  const { data } = useTenant()
  const section = getContentSection(data?.content || [], 'BookingTerms')

  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            {section?.title || 'Booking Policy'}
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
