export default function PricingPolicyPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            Pricing Policy
          </h1>
        </div>
      </div>
      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: 1.8, color: 'var(--gray-600)', fontSize: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>What's Included</h2>
            <p style={{ marginBottom: '1.5rem' }}>All our tour prices include accommodation, meals as specified, transportation, permits, and the services of an experienced guide. Detailed inclusions are listed on each tour page.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>What's Not Included</h2>
            <p style={{ marginBottom: '1.5rem' }}>International airfare, travel insurance, personal expenses, tips for guides and porters, and any items not listed in the inclusions are not covered in the tour price.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Currency & Payments</h2>
            <p style={{ marginBottom: '1.5rem' }}>Prices are listed in USD but can be paid in INR or EUR at the current exchange rate. We accept major credit cards, bank transfers, and selected digital payment methods.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Price Guarantee</h2>
            <p>Once your booking is confirmed with a deposit, your price is locked in and will not change regardless of currency fluctuations or other factors.</p>
          </div>
        </div>
      </section>
    </>
  )
}
