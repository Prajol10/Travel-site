'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface Lead {
  id: string
  fullName: string
  phoneNumber?: string
  email?: string
  message?: string
  tourInterest?: string
  status: string
  notes?: string
  source?: string
  createdAt: string
}

const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Closed']

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  async function loadLeads() {
    setLoading(true)
    try {
      const res = await api.get('/api/leads', { params: filter ? { status: filter } : {} })
      setLeads(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [filter])

  async function handleStatusChange(id: string, status: string) {
    await api.put(`/api/leads/${id}/status`, { status })
    loadLeads()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lead?')) return
    await api.delete(`/api/leads/${id}`)
    loadLeads()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A' }}>Leads</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Contact</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Tour Interest</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Message</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '0.75rem 1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>No leads yet.</td></tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#0F172A', fontWeight: 500 }}>{l.fullName}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>
                    {l.phoneNumber && <div>{l.phoneNumber}</div>}
                    {l.email && <div style={{ color: '#64748B', fontSize: '0.8rem' }}>{l.email}</div>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{l.tourInterest || '-'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155', maxWidth: '220px' }}>
                    <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {l.message || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <select
                      value={l.status}
                      onChange={(e) => handleStatusChange(l.id, e.target.value)}
                      style={{ padding: '0.3rem 0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.8rem' }}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#64748B', fontSize: '0.8rem' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(l.id)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Delete</button>
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
