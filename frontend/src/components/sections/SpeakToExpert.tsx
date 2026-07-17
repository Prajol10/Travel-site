'use client'
import Link from 'next/link'
import { Phone, MessageCircle } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

export default function SpeakToExpert() {
  const { tenant } = useTenant()
  if (!tenant?.phoneNumber && !tenant?.whatsAppNumber && !tenant?.email) return null

  const whatsappLink = tenant.whatsAppNumber
    ? `https://wa.me/${tenant.whatsAppNumber.replace(/[^0-9]/g, '')}`
    : null
  const callLink = tenant.phoneNumber ? `tel:${tenant.phoneNumber}` : null

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <div
          style={{
            background: 'var(--navy)',
            borderRadius: '16px',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <div style={{ maxWidth: '460px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
              Speak to an Expert
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Need assistance with your booking? Our team is here to help. Feel free to reach out with any questions or concerns.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
            {callLink && (
              <Link
                href={callLink}
                className="btn-gold"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Phone size={17} /> Schedule a Call
              </Link>
            )}
            {whatsappLink && (
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.8rem 1.5rem', borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff',
                  fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                }}
              >
                <MessageCircle size={17} /> WhatsApp Us
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
