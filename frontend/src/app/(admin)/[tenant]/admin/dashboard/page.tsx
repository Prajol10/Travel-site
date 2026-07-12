'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import { TourListDto } from '@/types'

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
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)', marginBottom: '1.5rem' }}>
        Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(27,43,75,0.08)' }}>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>Total Tours</div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)' }}>{loading ? '...' : tours.length}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(27,43,75,0.08)' }}>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>Featured Tours</div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)' }}>{loading ? '...' : tours.filter(t => t.isFeatured).length}</div>
        </div>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(27,43,75,0.08)' }}>
          <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>New Leads</div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--gold, #C9A84C)' }}>{loading ? '...' : leadCount}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)', marginBottom: '1rem' }}>Manage Website</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: 'block',
              background: '#fff',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(27,43,75,0.08)',
              textDecoration: 'none',
              borderLeft: '3px solid var(--gold, #C9A84C)',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--navy, #1B2B4B)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{s.label}</div>
            <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
