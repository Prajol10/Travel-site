'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import ImageUpload from '@/components/admin/ImageUpload'

interface Destination {
  id: string
  name: string
  country?: string
  description: string
  imageUrl?: string
  sortOrder: number
}

const emptyForm = {
  name: '',
  country: '',
  description: '',
  imageUrl: '',
  sortOrder: 0,
}

export default function DestinationsPage() {
  const [items, setItems] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function loadDestinations() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/destinations/${tenantId}`)
      setItems(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDestinations()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/api/destinations', form)
    setForm(emptyForm)
    setShowForm(false)
    loadDestinations()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this destination?')) return
    await api.delete(`/api/destinations/${id}`)
    loadDestinations()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Destinations</h1>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
          + Add Destination
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94A3B8' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#94A3B8' }}>No destinations yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {items.map((d) => (
            <div key={d.id} className="admin-card">
              {d.imageUrl && (
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }}
                />
              )}
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>{d.name}</div>
              <div style={{ color: '#8B95A5', fontSize: '0.78rem', marginBottom: '0.5rem' }}>{d.country || '-'}</div>
              <div style={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{d.description}</div>
              <button onClick={() => handleDelete(d.id)} className="admin-btn-danger" style={{ width: '100%' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '2rem 1rem' }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ width: '480px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-title">Add Destination</div>

            <div className="admin-field">
              <label className="admin-label">Name</label>
              <input required className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <span className="admin-help">e.g. "Everest Base Camp"</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Country</label>
              <input className="admin-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. Nepal" />
            </div>

            <div className="admin-field">
              <ImageUpload
                label="Destination Image"
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
                folder="destinations"
                recommendedSize="800 x 600"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <span className="admin-help">One or two sentences shown on the Destinations page</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Sort Order</label>
              <input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
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
