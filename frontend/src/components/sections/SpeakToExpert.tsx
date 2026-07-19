'use client'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

export default function SpeakToExpert() {
  const { tenant, data } = useTenant()
  if (!tenant?.phoneNumber && !tenant?.whatsAppNumber) return null

  const callLink = tenant.phoneNumber ? `tel:${tenant.phoneNumber}` : null
  const team = (data?.team || []).slice(0, 5)
  const lead = team[0]

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #E5E1D8',
            borderRadius: '16px',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ maxWidth: '420px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.85rem' }}>
              Speak to an Expert
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Need assistance with your booking? Our team is here to help. Feel free to reach out with any questions or concerns.
            </p>
            {callLink && (
              <Link
                href={callLink}
                className="btn-gold"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Phone size={17} /> Schedule a Call
              </Link>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            {team.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                {team.map((member, i) => (
                  <div
                    key={member.id}
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid #ffffff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      marginLeft: i > 0 ? '-0.9rem' : 0,
                      background: 'var(--navy)',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: team.length - i,
                    }}
                  >
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '1rem' }}>
                        {member.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {lead && (
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {lead.fullName}{lead.region ? ` · ${lead.region}` : ''}
              </div>
            )}
            {tenant.whatsAppNumber && (
              <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                WhatsApp <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{tenant.whatsAppNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
