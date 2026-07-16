'use client'
import { useTenant } from '@/context/TenantContext'
import { getContentSection } from '@/lib/utils'

const FALLBACK_BODY = `
  <p>The following documents are available upon request for verification purposes:</p>
  <ul>
    <li>Business Registration Certificate</li>
    <li>Tourism Board License</li>
    <li>Tax Clearance Certificate</li>
    <li>Insurance Certificate</li>
  </ul>
  <p>Please contact us if you would like copies of any of these documents.</p>
`

export default function LegalDocumentsPage() {
  const { data } = useTenant()
  const section = getContentSection(data?.content || [], 'DocumentRequirements')

  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            {section?.title || 'Legal Documents'}
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
