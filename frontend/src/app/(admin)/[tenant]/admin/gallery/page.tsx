'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import ImageUpload from '@/components/admin/ImageUpload'

interface GalleryItem {
  id: string
  url: string
  thumbnailUrl?: string
  caption?: string
  mediaType: string
  sortOrder: number
  isActive: boolean
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ url: '', thumbnailUrl: '', caption: '', mediaType: 'Photo', sortOrder: 0 })

  async function loadGallery() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/gallery/${tenantId}`)
      setItems(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGallery()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/api/gallery', form)
    setForm({ url: '', thumbnailUrl: '', caption: '', mediaType: 'Photo', sortOrder: 0 })
    setShowForm(false)
    loadGallery()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return
    await api.delete(`/api/gallery/${id}`)
    loadGallery()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Gallery</h1>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
          + Add Image
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#94A3B8' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#94A3B8' }}>No gallery items yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {items.map((item) => (
            <div key={item.id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={item.thumbnailUrl || item.url} alt={item.caption || ''} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '0.6rem' }}>{item.caption || 'No caption'}</div>
                <button onClick={() => handleDelete(item.id)} className="admin-btn-danger" style={{ width: '100%' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '2rem 1rem' }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ width: '440px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-title">Add Image</div>

            <div className="admin-field">
              <ImageUpload
                label="Image"
                value={form.url}
                onChange={(url) => setForm({ ...form, url })}
                folder="gallery"
                recommendedSize="1600 x 1067"
              />
              <span className="admin-help">Shown in the public Gallery section</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Caption</label>
              <input className="admin-input" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
              <span className="admin-help">Short text shown under or over this image</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Media Type</label>
              <select className="admin-select" value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })}>
                <option value="Photo">Photo</option>
                <option value="Video">Video</option>
              </select>
              <span className="admin-help">Choose Video if the URL points to a video file</span>
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
