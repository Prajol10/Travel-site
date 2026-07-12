'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'

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
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A' }}>Gallery</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '0.55rem 1rem', background: '#0F172A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
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
            <div key={item.id} style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <img src={item.thumbnailUrl || item.url} alt={item.caption || ''} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
              <div style={{ padding: '0.6rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '0.5rem' }}>{item.caption || 'No caption'}</div>
                <button onClick={() => handleDelete(item.id)} style={{ width: '100%', padding: '0.35rem', fontSize: '0.75rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '10px', padding: '1.75rem', width: '400px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0F172A' }}>Add Image</h2>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Image URL</label>
              <input required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Caption</label>
              <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Media Type</label>
              <select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}>
                <option value="Photo">Photo</option>
                <option value="Video">Video</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', background: '#0F172A', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
