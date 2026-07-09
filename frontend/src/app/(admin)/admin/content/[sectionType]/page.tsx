'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'

const typeMap: Record<string, string> = {
  hero: 'Hero',
  about: 'AboutUs',
  whychooseus: 'WhyChooseUs',
}

export default function ContentEditorPage() {
  const params = useParams()
  const rawType = params.sectionType as string
  const sectionType = typeMap[rawType] || rawType

  const [form, setForm] = useState({
    badgeText: '',
    title: '',
    subtitle: '',
    body: '',
    imageUrl: '',
    ctaText: '',
    ctaUrl: '',
    secondaryCtaText: '',
    secondaryCtaUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const tenantId = getUser()?.tenantId
    if (!tenantId) return
    api.get(`/api/content/${tenantId}/${sectionType}`)
      .then((res) => {
        if (res.data.data) {
          setForm((f) => ({ ...f, ...res.data.data }))
        }
      })
      .finally(() => setLoading(false))
  }, [sectionType])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await api.put(`/api/content/${sectionType}`, form)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ color: '#94A3B8' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '560px' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.5rem' }}>
        {sectionType} Editor
      </h1>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        {[
          { key: 'badgeText', label: 'Badge Text' },
          { key: 'title', label: 'Title' },
          { key: 'subtitle', label: 'Subtitle' },
          { key: 'body', label: 'Body', textarea: true },
          { key: 'imageUrl', label: 'Image URL' },
          { key: 'ctaText', label: 'CTA Text' },
          { key: 'ctaUrl', label: 'CTA URL' },
          { key: 'secondaryCtaText', label: 'Secondary CTA Text' },
          { key: 'secondaryCtaUrl', label: 'Secondary CTA URL' },
        ].map((f) => (
          <div key={f.key} style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>{f.label}</label>
            {f.textarea ? (
              <textarea
                value={(form as any)[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', minHeight: '90px' }}
              />
            ) : (
              <input
                value={(form as any)[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            )}
          </div>
        ))}

        <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', background: '#0F172A', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        {saved && <span style={{ marginLeft: '0.75rem', color: '#166534', fontSize: '0.85rem' }}>Saved!</span>}
      </form>
    </div>
  )
}
