'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import ImageUpload from '@/components/admin/ImageUpload'

interface Testimonial {
  id: string
  authorName: string
  authorPhotoUrl?: string
  authorLocation?: string
  tourName?: string
  reviewText: string
  rating: number
  reviewDate?: string
  sourcePlatform?: string
  sortOrder: number
}

const emptyForm = {
  authorName: '',
  authorPhotoUrl: '',
  authorLocation: '',
  tourName: '',
  reviewText: '',
  rating: 5,
  reviewDate: '',
  sourcePlatform: '',
  sortOrder: 0,
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function loadTestimonials() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/testimonials/${tenantId}`)
      setItems(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/api/testimonials', form)
    setForm(emptyForm)
    setShowForm(false)
    loadTestimonials()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await api.delete(`/api/testimonials/${id}`)
    loadTestimonials()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Testimonials</h1>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
          + Add Testimonial
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94A3B8' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#94A3B8' }}>No testimonials yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {items.map((t) => (
            <div key={t.id} className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <img
                  src={t.authorPhotoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(t.authorName)}
                  alt={t.authorName}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-pale)' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>{t.authorName}</div>
                  <div style={{ color: '#8B95A5', fontSize: '0.78rem' }}>{t.authorLocation || '-'}</div>
                </div>
              </div>
              <div style={{ color: 'var(--gold)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{'★'.repeat(Math.round(t.rating))}</div>
              <div style={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{t.reviewText}</div>
              <button onClick={() => handleDelete(t.id)} className="admin-btn-danger" style={{ width: '100%' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '2rem 1rem' }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ width: '480px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-title">Add Testimonial</div>

            <div className="admin-field">
              <label className="admin-label">Author Name</label>
              <input required className="admin-input" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
              <span className="admin-help">Name of the traveler leaving the review</span>
            </div>

            <div className="admin-field">
              <ImageUpload
                label="Author Photo"
                value={form.authorPhotoUrl}
                onChange={(url) => setForm({ ...form, authorPhotoUrl: url })}
                folder="testimonials"
                recommendedSize="200 x 200"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Author Location</label>
              <input className="admin-input" value={form.authorLocation} onChange={(e) => setForm({ ...form, authorLocation: e.target.value })} />
              <span className="admin-help">e.g. city and country of the traveler</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Tour Name</label>
              <input className="admin-input" value={form.tourName} onChange={(e) => setForm({ ...form, tourName: e.target.value })} />
              <span className="admin-help">Which tour this review is about</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Review Text</label>
              <textarea className="admin-textarea" value={form.reviewText} onChange={(e) => setForm({ ...form, reviewText: e.target.value })} />
              <span className="admin-help">The testimonial content shown on the public site</span>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label">Rating</label>
                <select className="admin-select" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                  <option value={5}>5 stars</option>
                  <option value={4}>4 stars</option>
                  <option value={3}>3 stars</option>
                  <option value={2}>2 stars</option>
                  <option value={1}>1 star</option>
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort Order</label>
                <input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label">Review Date</label>
              <input className="admin-input" value={form.reviewDate} onChange={(e) => setForm({ ...form, reviewDate: e.target.value })} placeholder="e.g. June 2026" />
            </div>

            <div className="admin-field">
              <label className="admin-label">Source Platform</label>
              <input className="admin-input" value={form.sourcePlatform} onChange={(e) => setForm({ ...form, sourcePlatform: e.target.value })} placeholder="e.g. Google, TripAdvisor" />
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
