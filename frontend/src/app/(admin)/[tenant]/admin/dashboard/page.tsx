'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import { TourListDto } from '@/types'
import { ExternalLink } from 'lucide-react'

export default function AdminDashboard() {
  const params = useParams()
  const tenant = params.tenant as string
  const sections = [
    { label: 'Hero Section', desc: 'Edit homepage hero banner, title & CTA', href: `/${tenant}/admin/content/hero` },
    { label: 'About Section', desc: 'Edit the about-us content block', href: `/${tenant}/admin/content/about` },
    { label: 'Why Choose Us', desc: 'Edit the why-choose-us content block', href: `/${tenant}/admin/content/whychooseus` },
    { label: 'Tours', desc: 'Add, edit or remove tour packages', href: `/${tenant}/admin/tours` },
    { label: 'Blog', desc: 'Write and publish blog posts', href: `/${tenant}/admin/blog` },
    { label: 'Gallery', desc: 'Manage photo & video gallery', href: `/${tenant}/admin/gallery` },
    { label: 'Team', desc: 'Manage team members shown on site', href: `/${tenant}/admin/team` },
    { label: 'Testimonials', desc: 'Manage customer reviews and ratings', href: `/${tenant}/admin/testimonials` },
    { label: 'Why Choose Us Items', desc: 'Manage the icon cards shown in Why Choose Us', href: `/${tenant}/admin/why-choose-us` },
    { label: 'Destinations', desc: 'Manage destinations shown on the Destinations page', href: `/${tenant}/admin/destinations` },
    { label: 'Trust Bar Stats', desc: 'Manage the stats shown below your homepage hero', href: `/${tenant}/admin/stats` },
    { label: 'Leads', desc: 'View and manage customer enquiries', href: `/${tenant}/admin/leads` },
    { label: 'Settings', desc: 'Branding, contact info & socials', href: `/${tenant}/admin/settings` },
  ]
  const [tours, setTours] = useState<TourListDto[]>([])
  const [loading, setLoading] = useState(true)
  const [leadCount, setLeadCount] = useState<number | null>(null)

  useEffect(() => {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    Promise.all([
      api.get(`/api/tours/${tenantId}`),
      api.get('/api/leads', { params: { status: 'New' } }),
    ])
      .then(([toursRes, leadsRes]) => {
        setTours(toursRes.data.data)
        setLeadCount(leadsRes.data.data.length)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy)' }}>
          Dashboard
        </h1>
        <Link
          href={`/${tenant}`}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn-secondary"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ExternalLink size={16} />
          View Live Site
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.75rem' }}>
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#8B95A5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tours</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy)', marginTop: '0.4rem' }}>{loading ? '...' : tours.length}</div>
        </div>
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#8B95A5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured Tours</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy)', marginTop: '0.4rem' }}>{loading ? '...' : tours.filter(t => t.isFeatured).length}</div>
        </div>
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#8B95A5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Leads</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold)', marginTop: '0.4rem' }}>{loading ? '...' : leadCount}</div>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.25rem' }}>Manage Website</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="admin-card admin-card-hover"
            style={{
              display: 'block',
              textDecoration: 'none',
              padding: '1.5rem',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.98rem', marginBottom: '0.35rem' }}>{s.label}</div>
            <div style={{ color: '#8B95A5', fontSize: '0.82rem' }}>{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
