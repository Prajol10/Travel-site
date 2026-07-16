'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { getUser } from '@/lib/auth'
import ImageUpload from '@/components/admin/ImageUpload'

const emptyForm = {
  name: '',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '',
  secondaryColor: '',
  tagLine: '',
  phoneNumber: '',
  whatsAppNumber: '',
  email: '',
  address: '',
  facebookUrl: '',
  instagramUrl: '',
  youTubeUrl: '',
  twitterUrl: '',
  defaultCurrency: '',
}

export default function SettingsPage() {
  const [form, setForm] = useState<any>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/api/tenant/me')
      .then((res) => setForm((f: any) => ({ ...f, ...res.data.data })))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await api.put('/api/tenant/me', form)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ color: '#94A3B8' }}>Loading...</div>

  const fields = [
    { key: 'name', label: 'Agency Name' },
    { key: 'tagLine', label: 'Tagline' },
    { key: 'primaryColor', label: 'Primary Color' },
    { key: 'secondaryColor', label: 'Secondary Color' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'whatsAppNumber', label: 'WhatsApp Number' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'facebookUrl', label: 'Facebook URL' },
    { key: 'instagramUrl', label: 'Instagram URL' },
    { key: 'youTubeUrl', label: 'YouTube URL' },
    { key: 'twitterUrl', label: 'Twitter URL' },
    { key: 'defaultCurrency', label: 'Default Currency' },
  ]

  return (
    <div style={{ maxWidth: '680px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>Settings</h1>

      <form onSubmit={handleSubmit} className="admin-card">
        <div className="admin-form-grid" style={{ marginBottom: '1.15rem' }}>
          <ImageUpload
            label="Logo"
            value={form.logoUrl || ''}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
            folder="branding/logo"
            recommendedSize="512 x 512"
            tenantId={getUser()?.tenantId}
          />
          <ImageUpload
            label="Favicon"
            value={form.faviconUrl || ''}
            onChange={(url) => setForm({ ...form, faviconUrl: url })}
            folder="branding/favicon"
            recommendedSize="64 x 64"
            tenantId={getUser()?.tenantId}
          />
        </div>
        <div className="admin-form-grid">
          {fields.map((f) => (
            <div key={f.key} className="admin-field">
              <label className="admin-label">{f.label}</label>
              <input
                className="admin-input"
                value={form[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
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
