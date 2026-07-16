'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUpload from '@/components/admin/ImageUpload'

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

  const sectionLabels: Record<string, string> = {
    Hero: 'Hero Section',
    AboutUs: 'About Us',
    WhyChooseUs: 'Why Choose Us',
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>
        {sectionLabels[sectionType] || sectionType} Editor
      </h1>

      <form onSubmit={handleSubmit} className="admin-card">
        {[
          { key: 'badgeText', label: 'Badge Text' },
          { key: 'title', label: 'Title' },
          { key: 'subtitle', label: 'Subtitle' },
          { key: 'body', label: 'Body', textarea: true },
          { key: 'ctaText', label: 'CTA Text' },
          { key: 'ctaUrl', label: 'CTA URL' },
          { key: 'secondaryCtaText', label: 'Secondary CTA Text' },
          { key: 'secondaryCtaUrl', label: 'Secondary CTA URL' },
        ].map((f) => (
          <div key={f.key} className="admin-field">
            <label className="admin-label">{f.label}</label>
            {f.textarea ? (
              <RichTextEditor
                value={(form as any)[f.key] || ''}
                onChange={(html) => setForm({ ...form, [f.key]: html })}
                placeholder={`Write the ${f.label.toLowerCase()}...`}
              />
            ) : (
              <input
                className="admin-input"
                value={(form as any)[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}

        <div className="admin-field">
          <ImageUpload
            label="Image"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            folder={`content/${sectionType.toLowerCase()}`}
            recommendedSize="1600 x 1067"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.5rem' }}>
          <button type="submit" disabled={saving} className="admin-btn-primary">
            {saving ? 'Saving...' : 'Save'}
          </button>
          {saved && <span style={{ color: '#166534', fontSize: '0.85rem', fontWeight: 600 }}>Saved!</span>}
        </div>
      </form>
    </div>
  )
}
