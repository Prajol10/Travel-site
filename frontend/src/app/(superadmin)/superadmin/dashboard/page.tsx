'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Tenant } from '@/types'
import LiveSiteLink from '@/components/superadmin/LiveSiteLink'

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  async function loadTenants() {
    setLoading(true)
    try {
      const res = await api.get('/api/superadmin/tenants')
      setTenants(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTenants()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this travel site? This cannot be undone.')) return
    await api.delete(`/api/superadmin/tenants/${id}`)
    loadTenants()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)' }}>Travel Sites</h1>
        <Link
          href="/superadmin/tenants/new"
          style={{ padding: '0.6rem 1.1rem', background: 'var(--navy, #1B2B4B)', color: '#fff', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
        >
          + Create New Travel Site
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Subdomain</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Created</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>Loading...</td></tr>
            ) : tenants.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>No travel sites yet.</td></tr>
            ) : (
              tenants.map((t) => (
                <tr key={t.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#0F172A', fontWeight: 500 }}>{t.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{t.subdomain}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: t.status === 'Active' ? '#DCFCE7' : '#FEE2E2', color: t.status === 'Active' ? '#166534' : '#991B1B' }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#64748B' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <LiveSiteLink subdomain={t.subdomain} />
                    <Link
                      href={`/superadmin/tenants/${t.id}/edit`}
                      style={{ marginRight: '0.5rem', padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#fff', textDecoration: 'none', color: '#334155' }}
                    >
                      Edit
                    </Link>
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
