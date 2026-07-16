'use client'
import { useTenant } from '@/context/TenantContext'
import { getContentSection } from '@/lib/utils'
const FALLBACK_BODY = `
  <h2>What's Included</h2>
  <p>All our tour prices include accommodation, meals as specified, transportation, permits, and the services of an experienced guide. Detailed inclusions are listed on each tour page.</p>
  <h2>What's Not Included</h2>
  <p>International airfare, travel insurance, personal expenses, tips for guides and porters, and any items not listed in the inclusions are not covered in the tour price.</p>
  <h2>Currency &amp; Payments</h2>
  <p>Prices are listed in USD but can be paid in INR or EUR at the current exchange rate. We accept major credit cards, bank transfers, and selected digital payment methods.</p>
  <h2>Price Guarantee</h2>
  <p>Once your booking is confirmed with a deposit, your price is locked in and will not change regardless of currency fluctuations or other factors.</p>
`
export default function PricingPolicyPage() {
  const { data } = useTenant()
  const section = getContentSection(data?.content || [], 'PricingPolicy')
  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            {section?.title || 'Pricing Policy'}
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
