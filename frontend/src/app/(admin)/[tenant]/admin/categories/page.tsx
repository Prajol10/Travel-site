'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUpload from '@/components/admin/ImageUpload'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  iconUrl?: string
  sortOrder: number
  isActive: boolean
  tourCount: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', iconUrl: '', sortOrder: 0 })

  async function loadCategories() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/tour-categories/${tenantId}`)
      setCategories(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function openCreate() {
    setForm({ name: '', description: '', iconUrl: '', sortOrder: 0 })
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(cat: Category) {
    setForm({ name: cat.name, description: cat.description || '', iconUrl: cat.iconUrl || '', sortOrder: cat.sortOrder })
    setEditingId(cat.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId) {
      await api.put(`/api/tour-categories/${editingId}`, form)
    } else {
      await api.post('/api/tour-categories', form)
    }
    setShowForm(false)
    loadCategories()
  }

  async function toggleActive(cat: Category) {
    await api.put(`/api/tour-categories/${cat.id}`, { isActive: !cat.isActive })
    loadCategories()
  }

  async function handleDelete(id: string, tourCount: number) {
    if (tourCount > 0) {
      alert(`This category has ${tourCount} tour(s) assigned. Reassign them before deleting.`)
      return
    }
    if (!confirm('Delete this category?')) return
    await api.delete(`/api/tour-categories/${id}`)
    loadCategories()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)' }}>Tour Categories</h1>
        <button onClick={openCreate} style={{ padding: '0.6rem 1.1rem', background: 'var(--navy, #1B2B4B)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          + New Category
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(27,43,75,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Slug</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Tours</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>No categories yet.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--navy, #1B2B4B)', fontWeight: 500 }}>{cat.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{cat.slug}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{cat.tourCount}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      onClick={() => toggleActive(cat)}
                      style={{
                        padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                        background: cat.isActive ? '#DCFCE7' : '#FEE2E2', color: cat.isActive ? '#166534' : '#991B1B',
                      }}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <button onClick={() => openEdit(cat)} style={{ marginRight: '0.5rem', padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(cat.id, cat.tourCount)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '10px', padding: '1.75rem', width: '400px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--navy, #1B2B4B)' }}>
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Description</label>
              <RichTextEditor
                value={form.description}
                onChange={(html) => setForm({ ...form, description: html })}
                placeholder="Write the category description..."
              />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <ImageUpload
                label="Icon"
                value={form.iconUrl}
                onChange={(url) => setForm({ ...form, iconUrl: url })}
                folder="categories"
                recommendedSize="128 x 128"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', background: 'var(--navy, #1B2B4B)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                {editingId ? 'Save' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
