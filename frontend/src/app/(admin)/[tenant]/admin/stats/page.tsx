'use client'

import { useEffect, useState } from 'react'
import { Users, Star, DollarSign, Leaf, Award, Clock, ShieldCheck, ThumbsUp } from 'lucide-react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'

interface StatItem {
  id: string
  value: string
  label: string
  iconName?: string
  sortOrder: number
}

const ICON_MAP: Record<string, any> = {
  users: Users,
  star: Star,
  'dollar-sign': DollarSign,
  leaf: Leaf,
  award: Award,
  clock: Clock,
  'shield-check': ShieldCheck,
  'thumbs-up': ThumbsUp,
}

const ICON_OPTIONS = ['users', 'star', 'dollar-sign', 'leaf', 'award', 'clock', 'shield-check', 'thumbs-up']

const emptyForm = {
  value: '',
  label: '',
  iconName: 'users',
  sortOrder: 0,
}

export default function StatsPage() {
  const [items, setItems] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function loadItems() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/stats/${tenantId}`)
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
    await api.post('/api/stats', form)
    setForm(emptyForm)
    setShowForm(false)
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this stat?')) return
    await api.delete(`/api/stats/${id}`)
    loadItems()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Trust Bar Stats</h1>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
          + Add Stat
        </button>
      </div>
      <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        These appear as the trust bar below your homepage hero (e.g. "19 Years+ Experience", "3400+ Reviews").
      </p>

      {loading ? (
        <div style={{ color: '#94A3B8' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#94A3B8' }}>No stats yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {items.map((item) => {
            const Icon = ICON_MAP[item.iconName?.toLowerCase() || ''] || Users
            return (
              <div key={item.id} className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} color="var(--gold)" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1.1rem' }}>{item.value}</div>
                    <div style={{ color: '#64748B', fontSize: '0.8rem' }}>{item.label}</div>
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="admin-btn-danger" style={{ width: '100%' }}>Delete</button>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '2rem 1rem' }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ width: '420px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-title">Add Stat</div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label">Value</label>
                <input required className="admin-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="e.g. 19 Years+" />
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort Order</label>
                <input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label">Label</label>
              <input required className="admin-input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Experience" />
            </div>

            <div className="admin-field">
              <label className="admin-label">Icon</label>
              <select className="admin-select" value={form.iconName} onChange={(e) => setForm({ ...form, iconName: e.target.value })}>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</option>
                ))}
              </select>
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
