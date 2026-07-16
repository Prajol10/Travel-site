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
  privacy: 'PrivacyPolicy',
  terms: 'TermsOfService',
  'booking-terms': 'BookingTerms',
  'document-requirements': 'DocumentRequirements',
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
    PrivacyPolicy: 'Privacy Policy',
    TermsOfService: 'Terms of Service',
    BookingTerms: 'Booking Terms',
    DocumentRequirements: 'Document Requirements',
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>
        {sectionLabels[sectionType] || sectionType} Editor
      </h1>

      <form onSubmit={handleSubmit} className="admin-card">
        {[
          { key: 'badgeText', label: 'Badge Text', help: 'Small label shown above the main heading' },
          { key: 'title', label: 'Title', help: 'The large heading text for this section' },
          { key: 'subtitle', label: 'Subtitle', help: 'Supporting line shown below the title' },
          { key: 'body', label: 'Body', textarea: true, help: 'Main paragraph content for this section' },
          { key: 'ctaText', label: 'CTA Text', help: 'Label on the primary button' },
          { key: 'ctaUrl', label: 'CTA URL', help: 'Where the primary button links to (e.g. /tours)' },
          { key: 'secondaryCtaText', label: 'Secondary CTA Text', help: 'Label on the secondary button' },
          { key: 'secondaryCtaUrl', label: 'Secondary CTA URL', help: 'Where the secondary button links to' },
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
            <span className="admin-help">{f.help}</span>
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
          <span className="admin-help">Background/featured image for this section</span>
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
