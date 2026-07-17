'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'

interface FaqItem {
  id: string
  question: string
  answer: string
  sortOrder: number
}

const emptyForm = {
  question: '',
  answer: '',
  sortOrder: 0,
}

export default function FaqsPage() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function loadItems() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/faqs/${tenantId}`)
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
    await api.post('/api/faqs', form)
    setForm(emptyForm)
    setShowForm(false)
    loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    await api.delete(`/api/faqs/${id}`)
    loadItems()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>FAQs</h1>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
          + Add FAQ
        </button>
      </div>
      <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        These general company FAQs appear on your homepage and tour pages (separate from each tour's own FAQ tab).
      </p>

      {loading ? (
        <div style={{ color: '#94A3B8' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#94A3B8' }}>No FAQs yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div key={item.id} className="admin-card">
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.question}</div>
              <div style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{item.answer}</div>
              <button onClick={() => handleDelete(item.id)} className="admin-btn-danger">Delete</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '2rem 1rem' }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ width: '480px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-title">Add FAQ</div>

            <div className="admin-field">
              <label className="admin-label">Question</label>
              <input required className="admin-input" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            </div>

            <div className="admin-field">
              <label className="admin-label">Answer</label>
              <textarea className="admin-textarea" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
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
