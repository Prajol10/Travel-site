'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  category?: string
  status: string
  publishedAt?: string
  createdAt: string
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', excerpt: '', body: '', coverImageUrl: '', category: '', seoTitle: '', seoDescription: '', publishNow: false })

  async function loadPosts() {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    setLoading(true)
    try {
      const res = await api.get(`/api/blog/${tenantId}`)
      setPosts(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/api/blog', form)
    setForm({ title: '', excerpt: '', body: '', coverImageUrl: '', category: '', seoTitle: '', seoDescription: '', publishNow: false })
    setShowForm(false)
    loadPosts()
  }

  async function handlePublish(id: string) {
    await api.put(`/api/blog/${id}/publish`)
    loadPosts()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    await api.delete(`/api/blog/${id}`)
    loadPosts()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A' }}>Blog</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '0.55rem 1rem', background: '#0F172A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          + New Post
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Title</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: 600 }}>Created</th>
              <th style={{ padding: '0.75rem 1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>Loading...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>No posts yet.</td></tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#0F172A', fontWeight: 500 }}>{p.title}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{p.category || '-'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: p.status === 'Published' ? '#DCFCE7' : '#FEF3C7', color: p.status === 'Published' ? '#166534' : '#92400E' }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#64748B', fontSize: '0.8rem' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    {p.status !== 'Published' && (
                      <button onClick={() => handlePublish(p.id)} style={{ marginRight: '0.5rem', padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid #86EFAC', color: '#166534', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Publish</button>
                    )}
                    <button onClick={() => handleDelete(p.id)} style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, overflowY: 'auto', padding: '2rem 0' }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '10px', padding: '1.75rem', width: '460px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0F172A' }}>New Post</h2>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', minHeight: '60px' }} />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Body</label>
              <RichTextEditor
                value={form.body}
                onChange={(html) => setForm({ ...form, body: html })}
                placeholder="Write the post body..."
              />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Cover Image URL</label>
              <input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={form.publishNow} onChange={(e) => setForm({ ...form, publishNow: e.target.checked })} />
              <label style={{ fontSize: '0.85rem', color: '#334155' }}>Publish immediately</label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', background: '#0F172A', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
