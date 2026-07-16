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
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Team</h1>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
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
            <div key={m.id} className="admin-card" style={{ textAlign: 'center' }}>
              <img
                src={m.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.fullName)}
                alt={m.fullName}
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.75rem', border: '2px solid var(--gold-pale)' }}
              />
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>{m.fullName}</div>
              <div style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '0.85rem' }}>{m.role || '-'}</div>
              <button onClick={() => handleDelete(m.id)} className="admin-btn-danger" style={{ width: '100%' }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '2rem 1rem' }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ width: '460px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-title">Add Team Member</div>
            {[
              { key: 'fullName', label: 'Full Name', required: true },
              { key: 'role', label: 'Role' },
              { key: 'region', label: 'Region' },
              { key: 'phoneNumber', label: 'Phone Number' },
              { key: 'email', label: 'Email' },
            ].map((f) => (
              <div key={f.key} className="admin-field">
                <label className="admin-label">{f.label}</label>
                <input
                  required={f.required}
                  className="admin-input"
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}

            <div className="admin-field">
              <ImageUpload
                label="Photo"
                value={form.photoUrl}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
                folder="team"
                recommendedSize="400 x 400"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
              <button type="button" className="admin-btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="admin-btn-primary" style={{ flex: 1 }}>Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
