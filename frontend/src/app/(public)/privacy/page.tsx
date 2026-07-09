export default function PrivacyPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            Privacy Policy
          </h1>
        </div>
      </div>
      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: 1.8, color: 'var(--gray-600)', fontSize: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Information We Collect</h2>
            <p style={{ marginBottom: '1.5rem' }}>We collect information you provide directly to us, such as when you make an enquiry, book a tour, or contact us. This includes your name, email address, phone number, and travel preferences.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>How We Use Your Information</h2>
            <p style={{ marginBottom: '1.5rem' }}>We use the information we collect to process your bookings, communicate with you about your travel plans, send you relevant travel information and offers, and improve our services.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Data Security</h2>
            <p style={{ marginBottom: '1.5rem' }}>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.5rem' }}>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our contact page.</p>
          </div>
        </div>
      </section>
    </>
  )
}
