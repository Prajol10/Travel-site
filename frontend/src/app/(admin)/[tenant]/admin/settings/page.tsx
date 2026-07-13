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
    <div style={{ maxWidth: '560px' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.5rem' }}>Settings</h1>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <ImageUpload
            label="Logo"
            value={form.logoUrl || ''}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
            folder="branding/logo"
            recommendedSize="512 x 512"
            tenantId={getUser()?.tenantId}
          />
        </div>
        <div style={{ marginBottom: '0.85rem' }}>
          <ImageUpload
            label="Favicon"
            value={form.faviconUrl || ''}
            onChange={(url) => setForm({ ...form, faviconUrl: url })}
            folder="branding/favicon"
            recommendedSize="64 x 64"
            tenantId={getUser()?.tenantId}
          />
        </div>
        {fields.map((f) => (
          <div key={f.key} style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>{f.label}</label>
            <input
              value={form[f.key] || ''}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
            />
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
