'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Search, Phone } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import CurrencySwitcher from './CurrencySwitcher'

const NAV_LINKS = [
  {
    label: 'Find Your Tour',
    href: '/tours',
    hasDropdown: true,
    dropdownItems: [
      { label: 'All Tours', href: '/tours' },
      { label: 'Featured Tours', href: '/tours?featured=true' },
      { label: 'View All Packages', href: '/tours' },
    ],
  },
  { label: 'Destinations', href: '/destinations' },
  {
    label: 'About',
    href: '/about',
    hasDropdown: true,
    dropdownItems: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/about#team' },
      { label: 'Why Choose Us', href: '/about#why-us' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const { tenant } = useTenant()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isSolid = scrolled || mobileOpen
  const whatsappNumber = tenant?.whatsAppNumber?.replace(/[^0-9]/g, '') || ''

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: isSolid ? '#ffffff' : 'transparent',
      boxShadow: isSolid ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', zIndex: 10 }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: isSolid ? 'var(--navy)' : 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700,
              color: 'var(--gold)', flexShrink: 0,
            }}>
              {tenant?.name?.charAt(0) || 'T'}
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem',
                color: isSolid ? 'var(--navy)' : '#ffffff',
                lineHeight: 1.2, whiteSpace: 'nowrap',
              }}>
                {tenant?.name || 'Travel Co.'}
              </div>
              <div style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.05em', lineHeight: 1 }}>
                Trip Planner
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden lg:flex">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.hasDropdown && setDropdownOpen(link.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  href={link.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '8px 14px', fontSize: '0.875rem', fontWeight: 500,
                    borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s',
                    color: isSolid ? 'var(--gray-700)' : 'rgba(255,255,255,0.92)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={13} />}
                </Link>

                {link.hasDropdown && link.dropdownItems && dropdownOpen === link.label && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: '4px',
                    width: '200px', background: '#ffffff', borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)', padding: '8px',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        style={{
                          display: 'block', padding: '10px 16px', fontSize: '0.875rem',
                          color: 'var(--gray-700)', textDecoration: 'none', borderRadius: '8px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--gold)'; (e.target as HTMLElement).style.background = 'var(--gold-pale)' }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--gray-700)'; (e.target as HTMLElement).style.background = 'transparent' }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="hidden lg:block">
              <CurrencySwitcher dark={isSolid} />
            </div>
            <button
              style={{
                padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent',
                color: isSolid ? 'var(--gray-600)' : '#ffffff', display: 'none',
              }}
              className="hidden lg:block"
            >
              <Search size={18} />
            </button>
            {whatsappNumber && (
              <a
                href={'https://wa.me/' + whatsappNumber}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#25D366', color: '#ffffff',
                  padding: '8px 16px', borderRadius: '999px',
                  fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
                className="hidden lg:flex"
              >
                <Phone size={14} />
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span style={{ fontSize: '0.65rem', opacity: 0.85, fontWeight: 400 }}>Call Us</span>
                  <span>{tenant?.phoneNumber || tenant?.whatsAppNumber}</span>
                </span>
              </a>
            )}

            {/* Mobile toggle */}
            <button
              style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: isSolid ? 'var(--navy)' : '#ffffff' }}
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: '#ffffff', borderTop: '1px solid var(--gray-100)', padding: '16px 24px' }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{ display: 'block', padding: '12px 0', color: 'var(--gray-700)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid var(--gray-50)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '16px' }}>
            <CurrencySwitcher dark />
          </div>
        </div>
      )}
    </nav>
  )
}
