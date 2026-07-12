export default function BookingPolicyPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            Booking Policy
          </h1>
        </div>
      </div>
      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: 1.8, color: 'var(--gray-600)', fontSize: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Reservation Process</h2>
            <p style={{ marginBottom: '1.5rem' }}>To reserve your spot on any of our tours, submit an enquiry through our contact form or call us directly. Our team will confirm availability and provide you with a detailed booking form.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Deposit & Payment</h2>
            <p style={{ marginBottom: '1.5rem' }}>A 30% deposit is required to confirm your booking. The remaining balance is due 30 days before your departure date. We accept Visa, Mastercard, and bank transfers.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Cancellation & Refunds</h2>
            <p style={{ marginBottom: '1.5rem' }}>Cancellations made more than 60 days before departure: 90% refund. 30-60 days: 50% refund. Less than 30 days: no refund. We strongly recommend travel insurance.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Travel Insurance</h2>
            <p>We strongly recommend that all travelers purchase comprehensive travel insurance covering trip cancellation, medical emergencies, and evacuation.</p>
          </div>
        </div>
      </section>
    </>
  )
}
