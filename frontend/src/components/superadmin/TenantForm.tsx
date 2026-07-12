'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import ImageUpload from '@/components/admin/ImageUpload'
import TenantUsers from './TenantUsers'

interface TenantFormData {
  name: string
  subdomain: string
  customDomain: string
  status: string
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  secondaryColor: string
  tagLine: string
  phoneNumber: string
  whatsAppNumber: string
  email: string
  address: string
  facebookUrl: string
  instagramUrl: string
  youTubeUrl: string
  twitterUrl: string
  defaultCurrency: string
  supportedCurrencies: string
  metaTitle: string
  metaDescription: string
  ogImageUrl: string
  googleAnalyticsId: string
  adminFullName: string
  adminEmail: string
  adminPassword: string
}

const sections = [
  { id: 'general', label: 'General' },
  { id: 'branding', label: 'Branding' },
  { id: 'contact', label: 'Contact & Social' },
  { id: 'seo', label: 'SEO & Analytics' },
  { id: 'admin', label: 'Admin Account' },
  { id: 'users', label: 'Admin Users' },
] as const

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  let pwd = ''
  for (let i = 0; i < 14; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)]
  }
  return pwd
}

export function initTenantForm(tenant?: any): TenantFormData {
  return {
    name: tenant?.name || '',
    subdomain: tenant?.subdomain || '',
    customDomain: tenant?.customDomain || '',
    status: tenant?.status || 'Active',
    logoUrl: tenant?.logoUrl || '',
    faviconUrl: tenant?.faviconUrl || '',
    primaryColor: tenant?.primaryColor || '#C9A84C',
    secondaryColor: tenant?.secondaryColor || '#1B2B4B',
    tagLine: tenant?.tagLine || '',
    phoneNumber: tenant?.phoneNumber || '',
    whatsAppNumber: tenant?.whatsAppNumber || '',
    email: tenant?.email || '',
    address: tenant?.address || '',
    facebookUrl: tenant?.facebookUrl || '',
    instagramUrl: tenant?.instagramUrl || '',
    youTubeUrl: tenant?.youTubeUrl || '',
    twitterUrl: tenant?.twitterUrl || '',
    defaultCurrency: tenant?.defaultCurrency || 'USD',
    supportedCurrencies: tenant?.supportedCurrencies || 'USD,INR,EUR',
    metaTitle: tenant?.metaTitle || '',
    metaDescription: tenant?.metaDescription || '',
    ogImageUrl: tenant?.ogImageUrl || '',
    googleAnalyticsId: tenant?.googleAnalyticsId || '',
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
  }
}

function SectionCard({
  id,
  title,
  registerRef,
  children,
}: {
  id: string
  title: string
  registerRef: (el: HTMLDivElement | null) => void
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      ref={registerRef}
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '1.75rem',
        boxShadow: '0 1px 3px rgba(27,43,75,0.08)',
        marginBottom: '1.5rem',
        scrollMarginTop: '5.5rem',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--navy, #1B2B4B)',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid #EEF1F5',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function TenantForm({ initial, tenantId }: { initial: TenantFormData; tenantId?: string }) {
  const router = useRouter()
  const [form, setForm] = useState<TenantFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<{ email: string; password: string; subdomain: string } | null>(null)
  const [activeSection, setActiveSection] = useState<string>('general')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  function update(patch: Partial<TenantFormData>) {
    setForm((f) => ({ ...f, ...patch }))
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
    )

    sections.forEach((s) => {
      const el = sectionRefs.current[s.id]
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  function scrollToSection(id: string) {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  async function handleSave() {
    setError('')

    if (!tenantId && (!form.adminEmail || !form.adminPassword)) {
      setError('Admin Email and Admin Password are required to create a login for this travel site.')
      scrollToSection('admin')
      return
    }

    setSaving(true)
    try {
      if (tenantId) {
        const payload = {
          name: form.name,
          customDomain: form.customDomain || null,
          logoUrl: form.logoUrl || null,
          faviconUrl: form.faviconUrl || null,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          tagLine: form.tagLine || null,
          phoneNumber: form.phoneNumber || null,
          whatsAppNumber: form.whatsAppNumber || null,
          email: form.email || null,
          address: form.address || null,
          facebookUrl: form.facebookUrl || null,
          instagramUrl: form.instagramUrl || null,
          youTubeUrl: form.youTubeUrl || null,
          twitterUrl: form.twitterUrl || null,
          defaultCurrency: form.defaultCurrency,
          supportedCurrencies: form.supportedCurrencies,
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
          ogImageUrl: form.ogImageUrl || null,
          googleAnalyticsId: form.googleAnalyticsId || null,
        }
        await api.put(`/api/superadmin/tenants/${tenantId}`, payload)
        router.push('/superadmin/dashboard')
      } else {
        const createPayload = {
          name: form.name,
          subdomain: form.subdomain,
          adminFullName: form.adminFullName,
          adminEmail: form.adminEmail,
          adminPassword: form.adminPassword,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          tagLine: form.tagLine,
          phoneNumber: form.phoneNumber,
          whatsAppNumber: form.whatsAppNumber,
          defaultCurrency: form.defaultCurrency,
        }
        const createRes = await api.post('/api/superadmin/tenants', createPayload)
        const newTenantId = createRes.data.data.id

        if (form.logoUrl || form.faviconUrl || form.email || form.address) {
          await api.put(`/api/superadmin/tenants/${newTenantId}`, {
            logoUrl: form.logoUrl || null,
            faviconUrl: form.faviconUrl || null,
            email: form.email || null,
            address: form.address || null,
            facebookUrl: form.facebookUrl || null,
            instagramUrl: form.instagramUrl || null,
            youTubeUrl: form.youTubeUrl || null,
            twitterUrl: form.twitterUrl || null,
            metaTitle: form.metaTitle || null,
            metaDescription: form.metaDescription || null,
            ogImageUrl: form.ogImageUrl || null,
            googleAnalyticsId: form.googleAnalyticsId || null,
          })
        }

        setCreated({ email: form.adminEmail, password: form.adminPassword, subdomain: form.subdomain })
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save. Please check the fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (created) {
    return (
      <div style={{ maxWidth: '520px', margin: '3rem auto', background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(27,43,75,0.08)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)', marginBottom: '0.5rem' }}>
          Travel Site Created
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Save these admin login details now — the password will not be shown again.
        </p>
        <div style={{ background: '#F7F6F2', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '0.9rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Admin Panel URL</div>
            <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{`/${created.subdomain}/admin`}</div>
          </div>
          <div style={{ marginBottom: '0.9rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Email</div>
            <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{created.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Password</div>
            <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{created.password}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push('/superadmin/dashboard')}
          style={{ padding: '0.65rem 1.5rem', border: 'none', borderRadius: '8px', background: 'var(--navy, #1B2B4B)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Continue to Dashboard
        </button>
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }
  const colorInputStyle = { width: '52px', height: '38px', padding: '0.2rem', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer' }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#F7F6F2',
          paddingTop: '0.5rem',
          paddingBottom: '0.75rem',
          marginBottom: '0.75rem',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              style={{
                padding: '0.6rem 0.9rem',
                background: activeSection === s.id ? '#fff' : 'none',
                border: 'none',
                borderBottom: activeSection === s.id ? '2px solid var(--gold, #C9A84C)' : '2px solid transparent',
                borderRadius: '8px 8px 0 0',
                color: activeSection === s.id ? 'var(--navy, #1B2B4B)' : '#94A3B8',
                fontWeight: activeSection === s.id ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#FEF2F2', color: '#B91C1C', fontSize: '0.85rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {/* General */}
      <SectionCard id="general" title="General" registerRef={(el) => (sectionRefs.current['general'] = el)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Agency Name</label>
            <input value={form.name} onChange={(e) => update({ name: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Subdomain{tenantId ? ' (locked after creation)' : ''}</label>
            <input
              value={form.subdomain}
              onChange={(e) => update({ subdomain: e.target.value.toLowerCase().trim() })}
              disabled={!!tenantId}
              style={{ ...inputStyle, opacity: tenantId ? 0.6 : 1, cursor: tenantId ? 'not-allowed' : 'text' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Custom Domain (optional)</label>
            <input value={form.customDomain} onChange={(e) => update({ customDomain: e.target.value })} placeholder="e.g. www.agency.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={(e) => update({ status: e.target.value })} style={inputStyle} disabled={!tenantId}>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Tagline</label>
            <input value={form.tagLine} onChange={(e) => update({ tagLine: e.target.value })} placeholder="e.g. Adventures beyond the ordinary" style={inputStyle} />
          </div>
        </div>
      </SectionCard>

      {/* Branding */}
      <SectionCard id="branding" title="Branding" registerRef={(el) => (sectionRefs.current['branding'] = el)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <ImageUpload
            label="Logo"
            value={form.logoUrl}
            onChange={(url) => update({ logoUrl: url })}
            folder="branding/logo"
            recommendedSize="512 x 512"
            tenantId={tenantId}
          />
          <ImageUpload
            label="Favicon"
            value={form.faviconUrl}
            onChange={(url) => update({ faviconUrl: url })}
            folder="branding/favicon"
            recommendedSize="64 x 64"
            tenantId={tenantId}
          />
        </div>
        {!tenantId && (
          <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: '#F5EDD6', color: '#7A5F1F', fontSize: '0.8rem', borderRadius: '8px' }}>
            Logo/favicon uploads here are held until you click Create Travel Site below — the tenant needs to exist first before files can be stored under its folder.
          </div>
        )}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <label style={labelStyle}>Primary Color</label>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <input type="color" value={form.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })} style={colorInputStyle} />
              <input value={form.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })} style={{ ...inputStyle, width: '110px' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Secondary Color</label>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <input type="color" value={form.secondaryColor} onChange={(e) => update({ secondaryColor: e.target.value })} style={colorInputStyle} />
              <input value={form.secondaryColor} onChange={(e) => update({ secondaryColor: e.target.value })} style={{ ...inputStyle, width: '110px' }} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Contact & Social */}
      <SectionCard id="contact" title="Contact & Social" registerRef={(el) => (sectionRefs.current['contact'] = el)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input value={form.phoneNumber} onChange={(e) => update({ phoneNumber: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp Number</label>
            <input value={form.whatsAppNumber} onChange={(e) => update({ whatsAppNumber: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Contact Email</label>
            <input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Default Currency</label>
            <select value={form.defaultCurrency} onChange={(e) => update({ defaultCurrency: e.target.value })} style={inputStyle}>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Address</label>
            <input value={form.address} onChange={(e) => update({ address: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Facebook URL</label>
            <input value={form.facebookUrl} onChange={(e) => update({ facebookUrl: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Instagram URL</label>
            <input value={form.instagramUrl} onChange={(e) => update({ instagramUrl: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>YouTube URL</label>
            <input value={form.youTubeUrl} onChange={(e) => update({ youTubeUrl: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Twitter / X URL</label>
            <input value={form.twitterUrl} onChange={(e) => update({ twitterUrl: e.target.value })} style={inputStyle} />
          </div>
        </div>
      </SectionCard>

      {/* SEO & Analytics */}
      <SectionCard id="seo" title="SEO & Analytics" registerRef={(el) => (sectionRefs.current['seo'] = el)}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Meta Title</label>
          <input value={form.metaTitle} onChange={(e) => update({ metaTitle: e.target.value })} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Meta Description</label>
          <textarea value={form.metaDescription} onChange={(e) => update({ metaDescription: e.target.value })} style={{ ...inputStyle, minHeight: '80px' }} />
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <ImageUpload
            label="Social Share Image (OG Image)"
            value={form.ogImageUrl}
            onChange={(url) => update({ ogImageUrl: url })}
            folder="branding/og"
            recommendedSize="1200 x 630"
            tenantId={tenantId}
          />
        </div>
        <div>
          <label style={labelStyle}>Google Analytics ID</label>
          <input value={form.googleAnalyticsId} onChange={(e) => update({ googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" style={inputStyle} />
        </div>
      </SectionCard>

      {/* Admin Account */}
      {!tenantId && (
        <SectionCard id="admin" title="Admin Account" registerRef={(el) => (sectionRefs.current['admin'] = el)}>
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#F5EDD6', color: '#7A5F1F', fontSize: '0.8rem', borderRadius: '8px' }}>
            Required — without these, no one will be able to log into this travel site's admin panel.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Admin Full Name</label>
              <input value={form.adminFullName} onChange={(e) => update({ adminFullName: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Admin Email *</label>
              <input type="email" value={form.adminEmail} onChange={(e) => update({ adminEmail: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Admin Password *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={form.adminPassword} onChange={(e) => update({ adminPassword: e.target.value })} required style={inputStyle} />
                <button
                  type="button"
                  onClick={() => update({ adminPassword: generatePassword() })}
                  style={{ padding: '0 0.9rem', border: '1px solid #CBD5E1', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {tenantId && (
        <SectionCard id="users" title="Admin Users" registerRef={(el) => (sectionRefs.current['users'] = el)}>
          <TenantUsers tenantId={tenantId} />
        </SectionCard>
      )}

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          gap: '0.6rem',
          padding: '1rem',
          background: '#fff',
          borderTop: '1px solid #E2E8F0',
          borderRadius: '12px',
          boxShadow: '0 -2px 8px rgba(27,43,75,0.06)',
        }}
      >
        <button
          type="button"
          onClick={() => router.push('/superadmin/dashboard')}
          style={{ padding: '0.65rem 1.25rem', border: '1px solid #CBD5E1', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '0.65rem 1.5rem', border: 'none', borderRadius: '8px', background: 'var(--navy, #1B2B4B)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving...' : tenantId ? 'Save Changes' : 'Create Travel Site'}
        </button>
      </div>
    </div>
  )
}
