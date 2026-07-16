'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import { TourListDto } from '@/types'

export default function AdminToursPage() {
  const params = useParams()
  const tenant = params.tenant as string
  const [tours, setTours] = useState<TourListDto[]>([])
  const [loading, setLoading] = useState(true)

  async function loadTours() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/tours/${tenantId}`)
      setTours(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTours()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this tour?')) return
    await api.delete(`/api/tours/${id}`)
    loadTours()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Tours</h1>
        <Link href={`/${tenant}/admin/tours/new`} className="admin-btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
          + New Tour
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Title</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Duration</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Price (USD)</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Featured</th>
              <th style={{ padding: '0.75rem 1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>Loading...</td></tr>
            ) : tours.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>No tours yet.</td></tr>
            ) : (
              tours.map((t) => (
                <tr key={t.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--navy, #1B2B4B)', fontWeight: 500 }}>{t.title}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{t.durationDays}D/{t.durationNights}N</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>${t.priceUSD}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{t.isFeatured ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <Link href={`/${tenant}/admin/tours/${t.id}/edit`} className="admin-btn-secondary" style={{ marginRight: '0.5rem', padding: '0.4rem 0.9rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block' }}>Edit</Link>
                    <button onClick={() => handleDelete(t.id)} className="admin-btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
