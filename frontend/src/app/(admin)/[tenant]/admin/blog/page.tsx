'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUpload from '@/components/admin/ImageUpload'

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
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>Blog</h1>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary">
          + New Post
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, overflowY: 'auto', padding: '2rem 1rem' }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ width: '540px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="admin-card-title">New Post</div>

            <div className="admin-field">
              <label className="admin-label">Title</label>
              <input required className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <span className="admin-help">The headline shown on the blog list and post page</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Excerpt</label>
              <textarea className="admin-textarea" style={{ minHeight: '60px' }} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              <span className="admin-help">Short summary shown on the blog list page</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Body</label>
              <RichTextEditor
                value={form.body}
                onChange={(html) => setForm({ ...form, body: html })}
                placeholder="Write the post body..."
              />
              <span className="admin-help">The full article content</span>
            </div>

            <div className="admin-field">
              <ImageUpload
                label="Cover Image"
                value={form.coverImageUrl}
                onChange={(url) => setForm({ ...form, coverImageUrl: url })}
                folder="blog"
                recommendedSize="1200 x 630"
              />
              <span className="admin-help">Featured image shown on the blog list and post header</span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Category</label>
              <input className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <span className="admin-help">Used to group and filter posts on the blog page</span>
            </div>

            <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={form.publishNow} onChange={(e) => setForm({ ...form, publishNow: e.target.checked })} />
              <label style={{ fontSize: '0.85rem', color: '#334155' }}>Publish immediately</label>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
              <button type="button" className="admin-btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="admin-btn-primary" style={{ flex: 1 }}>Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
