'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import ImageUpload from '@/components/admin/ImageUpload'

interface TeamMember {
  id: string
  fullName: string
  role?: string
  region?: string
  phoneNumber?: string
  email?: string
  photoUrl?: string
  sortOrder: number
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fullName: '', role: '', region: '', phoneNumber: '', email: '', photoUrl: '', sortOrder: 0 })

  async function loadTeam() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/team/${tenantId}`)
      setMembers(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/api/team', form)
    setForm({ fullName: '', role: '', region: '', phoneNumber: '', email: '', photoUrl: '', sortOrder: 0 })
    setShowForm(false)
    loadTeam()
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this team member?')) return
    await api.delete(`/api/team/${id}`)
    loadTeam()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A' }}>Team</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '0.55rem 1rem', background: '#0F172A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          + Add Member
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94A3B8' }}>Loading...</div>
      ) : members.length === 0 ? (
        <div style={{ color: '#94A3B8' }}>No team members yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {members.map((m) => (
            <div key={m.id} style={{ background: '#fff', borderRadius: '10px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <img
                src={m.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.fullName)}
                alt={m.fullName}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.6rem' }}
              />
              <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9rem' }}>{m.fullName}</div>
              <div style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{m.role || '-'}</div>
              <button onClick={() => handleDelete(m.id)} style={{ width: '100%', padding: '0.35rem', fontSize: '0.75rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '10px', padding: '1.75rem', width: '400px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0F172A' }}>Add Team Member</h2>
            {[
              { key: 'fullName', label: 'Full Name', required: true },
              { key: 'role', label: 'Role' },
              { key: 'region', label: 'Region' },
              { key: 'phoneNumber', label: 'Phone Number' },
              { key: 'email', label: 'Email' },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>{f.label}</label>
                <input
                  required={f.required}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '0.85rem' }}>
              <ImageUpload
                label="Photo"
                value={form.photoUrl}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
                folder="team"
                recommendedSize="400 x 400"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', background: '#0F172A', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
