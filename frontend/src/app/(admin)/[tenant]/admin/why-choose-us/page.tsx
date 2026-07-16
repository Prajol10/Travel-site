'use client'

import { useEffect, useState } from 'react'
import { Shield, Users, Heart, Headphones } from 'lucide-react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'

interface WhyChooseUsItem {
  id: string
  title: string
  description: string
  iconName?: string
  sortOrder: number
}

const ICON_MAP: Record<string, any> = {
  shield: Shield,
  users: Users,
  heart: Heart,
  headphones: Headphones,
}

const ICON_OPTIONS = ['shield', 'users', 'heart', 'headphones']

const emptyForm = {
  title: '',
  description: '',
  iconName: 'shield',
  sortOrder: 0,
}

export default function WhyChooseUsPage() {
  const [items, setItems] = useState<WhyChooseUsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function loadItems() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/whychooseus/${tenantId}`)
      setItems(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/api/whychooseus', form)
    setForm(emptyForm)
    setShowForm(false)
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    await api.delete(`/api/whychooseus/${id}`)
    loadItems()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Why Choose Us</h1>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
          + Add Item
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94A3B8' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#94A3B8' }}>No items yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {items.map((item) => {
            const Icon = ICON_MAP[item.iconName?.toLowerCase() || ''] || Shield
            return (
              <div key={item.id} className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={22} color="var(--gold)" strokeWidth={1.5} />
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>{item.title}</div>
                </div>
                <div style={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{item.description}</div>
                <button onClick={() => handleDelete(item.id)} className="admin-btn-danger" style={{ width: '100%' }}>Delete</button>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '2rem 1rem' }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ width: '480px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-title">Add Why Choose Us Item</div>

            <div className="admin-field">
              <label className="admin-label">Title</label>
              <input required className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <span className="admin-help">Short heading, e.g. "Expert Local Guides"</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <span className="admin-help">One or two sentences shown under the title</span>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label">Icon</label>
                <select className="admin-select" value={form.iconName} onChange={(e) => setForm({ ...form, iconName: e.target.value })}>
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
                <span className="admin-help">Icon shown above the title on the live site</span>
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort Order</label>
                <input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </div>
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
