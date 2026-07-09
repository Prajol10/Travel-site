'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import { TourListDto } from '@/types'

export default function AdminToursPage() {
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
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)' }}>Tours</h1>
        <Link href="/admin/tours/new" style={{ padding: '0.6rem 1.1rem', background: 'var(--navy, #1B2B4B)', color: '#fff', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
          + New Tour
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(27,43,75,0.08)' }}>
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
                    <Link href={`/admin/tours/${t.id}/edit`} style={{ marginRight: '0.5rem', padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#fff', textDecoration: 'none', color: '#334155' }}>Edit</Link>
                    <button onClick={() => handleDelete(t.id)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Delete</button>
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
