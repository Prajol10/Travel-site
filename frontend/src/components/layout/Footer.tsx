'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Send, MapPin, Phone, Mail } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'

export default function Footer() {
  const { tenant, data } = useTenant()
  const [email, setEmail] = useState('')
  const topTours = data?.tours?.slice(0, 4) || []

  return (
    <footer style={{ background: 'var(--navy-dark)', color: '#ffffff', paddingTop: '5rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '4rem',
        }}>
          {/* Brand */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            padding: '1.75rem',
            gridColumn: 'span 1',
          }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>
              Operated &amp; Managed By
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}>
              {tenant?.name || 'Travel Company'}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {tenant?.tagLine || 'Your trusted partner for spiritual and adventure journeys'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              {tenant?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                  <Phone size={14} color="var(--gold)" />
                  {tenant.phoneNumber}
                </div>
              )}
              {tenant?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                  <Mail size={14} color="var(--gold)" />
                  {tenant.email}
                </div>
              )}
              {tenant?.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                  <MapPin size={14} color="var(--gold)" />
                  {tenant.address}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', color: '#ffffff' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['About Us|/about', 'Our Team|/about#team', 'Contact Us|/contact'].map((item) => {
                const [label, href] = item.split('|')
                return (
                  <li key={label}>
                    <Link href={href} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>
                      › {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', color: '#ffffff' }}>Popular Tours</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topTours.length > 0 ? topTours.map((tour) => (
                <li key={tour.id}>
                  <Link href={tenantUrl(tenant?.subdomain, `/tours/${tour.slug}`)} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>
                    › {tour.title}
                  </Link>
                </li>
              )) : (
                <li style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>No tours yet</li>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', color: '#ffffff' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Booking Policy|/legal/booking', 'Legal Documents|/legal/documents', 'Pricing Policy|/legal/pricing'].map((item) => {
                const [label, href] = item.split('|')
                return (
                  <li key={label}>
                    <Link href={tenantUrl(tenant?.subdomain, href)} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>
                      › {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.25rem', color: '#ffffff' }}>Newsletter</h4>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: '1rem' }}>Get travel tips and offers</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '0.5rem',
                  padding: '0.625rem 1rem',
                  fontSize: '0.875rem',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
              <button style={{
                background: 'var(--gold)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.625rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                Subscribe <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.35)',
        }}>
          <p>© {new Date().getFullYear()} {tenant?.name || 'Travel Platform'}. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link href={tenantUrl(tenant?.subdomain, '/privacy')} style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href={tenantUrl(tenant?.subdomain, '/terms')} style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
