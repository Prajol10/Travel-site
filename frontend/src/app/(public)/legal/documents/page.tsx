export default function LegalDocumentsPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            Legal Documents
          </h1>
        </div>
      </div>
      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {['Business Registration Certificate', 'Tourism Board License', 'Tax Clearance Certificate', 'Insurance Certificate'].map((doc) => (
              <div key={doc} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '8px', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{doc}</div>
                    <div style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Official document</div>
                  </div>
                </div>
                <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.875rem' }}>View →</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
