'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Send, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.6rem' }}>
        {children}
      </h4>
      <div style={{ width: '2rem', height: '2px', background: 'var(--gold)' }} />
    </div>
  )
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.875rem',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      <span style={{ color: 'var(--gold)' }}>›</span> {children}
    </Link>
  )
}

export default function Footer() {
  const { tenant, data } = useTenant()
  const [email, setEmail] = useState('')
  const topTours = data?.tours?.slice(0, 4) || []
  const topDestinations = data?.destinations?.slice(0, 4) || []

  return (
    <footer style={{ background: 'var(--navy-dark)', color: '#ffffff', paddingTop: '5.5rem', paddingBottom: '2rem', borderTop: '3px solid var(--gold)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          paddingBottom: '4rem',
        }}>
          {/* Brand */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '1rem',
            padding: '2rem',
            gridColumn: 'span 1',
          }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.85rem', fontWeight: 600 }}>
              Operated &amp; Managed By
            </p>
            {tenant?.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.name} style={{ maxHeight: '2.75rem', maxWidth: '160px', objectFit: 'contain', marginBottom: '0.85rem' }} />
            ) : (
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.85rem', color: '#ffffff', lineHeight: 1.2 }}>
                {tenant?.name || 'Travel Company'}
              </h3>
            )}
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {tenant?.tagLine || 'Your trusted partner for spiritual and adventure journeys'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {tenant?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                  <Phone size={14} color="var(--gold)" />
                  {tenant.phoneNumber}
                </div>
              )}
              {tenant?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                  <Mail size={14} color="var(--gold)" />
                  {tenant.email}
                </div>
              )}
              {tenant?.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,255,255,0.75)' }}>
                  <MapPin size={14} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  {tenant.address}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {['About Us|/about', 'Our Team|/about#team', 'Contact Us|/contact'].map((item) => {
                const [label, href] = item.split('|')
                return (
                  <li key={label}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <FooterHeading>Popular Tours</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {topTours.length > 0 ? topTours.map((tour) => (
                <li key={tour.id}>
                  <FooterLink href={tenantUrl(tenant?.subdomain, `/tours/${tour.slug}`)}>{tour.title}</FooterLink>
                </li>
              )) : (
                <li style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>No tours yet</li>
              )}
            </ul>
          </div>

          {/* Destinations */}
          {topDestinations.length > 0 && (
            <div>
              <FooterHeading>Destinations</FooterHeading>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {topDestinations.map((dest) => (
                  <li key={dest.id}>
                    <FooterLink href={tenantUrl(tenant?.subdomain, '/destinations')}>{dest.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          <div>
            <FooterHeading>Resources</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {['Booking Policy|/legal/booking', 'Legal Documents|/legal/documents', 'Pricing Policy|/legal/pricing'].map((item) => {
                const [label, href] = item.split('|')
                return (
                  <li key={label}>
                    <FooterLink href={tenantUrl(tenant?.subdomain, href)}>{label}</FooterLink>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <FooterHeading>Newsletter</FooterHeading>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: '1.1rem' }}>Get travel tips and offers</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '0.5rem',
                  padding: '0.7rem 1rem',
                  fontSize: '0.875rem',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
              <button style={{
                background: 'var(--gold)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.7rem 1rem',
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

        {/* Social icons */}
        {(tenant?.facebookUrl || tenant?.instagramUrl || tenant?.youTubeUrl || tenant?.twitterUrl) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', paddingBottom: '2.75rem' }}>
            {tenant.facebookUrl && (
              <Link href={tenant.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Facebook size={17} color="rgba(255,255,255,0.75)" />
              </Link>
            )}
            {tenant.instagramUrl && (
              <Link href={tenant.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Instagram size={17} color="rgba(255,255,255,0.75)" />
              </Link>
            )}
            {tenant.youTubeUrl && (
              <Link href={tenant.youTubeUrl} target="_blank" rel="noopener noreferrer" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Youtube size={17} color="rgba(255,255,255,0.75)" />
              </Link>
            )}
            {tenant.twitterUrl && (
              <Link href={tenant.twitterUrl} target="_blank" rel="noopener noreferrer" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Twitter size={17} color="rgba(255,255,255,0.75)" />
              </Link>
            )}
          </div>
        )}

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <p>© {new Date().getFullYear()} {tenant?.name || 'Travel Platform'}. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href={tenantUrl(tenant?.subdomain, '/privacy')} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href={tenantUrl(tenant?.subdomain, '/terms')} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
