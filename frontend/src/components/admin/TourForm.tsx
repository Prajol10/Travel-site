'use client'

import { useEffect, useRef, useState } from 'react'
import api from '@/lib/api'
import { useRouter, useParams } from 'next/navigation'
import RichTextEditor from './RichTextEditor'
import ImageUpload from './ImageUpload'
import GoogleSearchPreview from './GoogleSearchPreview'

interface ItineraryDay {
  day: number
  title: string
  description: string
}

interface FaqItem {
  question: string
  answer: string
}

interface TourFormData {
  title: string
  slug: string
  shortDescription: string
  fullDescription: string
  durationDays: number
  durationNights: number
  priceUSD: number
  priceINR: string
  priceEUR: string
  coverImageUrl: string
  imageUrlsList: string[]
  difficulty: string
  maxAltitude: string
  maxGroupSize: string
  isFeatured: boolean
  isActive: boolean
  seoTitle: string
  seoDescription: string
  highlightsList: string[]
  itineraryList: ItineraryDay[]
  inclusionsList: string[]
  exclusionsList: string[]
  videoUrl: string
  faqsList: FaqItem[]
  knowBeforeList: string[]
}

const sections = [
  { id: 'general', label: 'General' },
  { id: 'content', label: 'Content' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'inclusions', label: 'Inclusions & Exclusions' },
  { id: 'video-faqs', label: 'Video, FAQs & Tips' },
  { id: 'media-seo', label: 'Media & SEO' },
] as const

function parseListField(raw?: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseItinerary(raw?: string): ItineraryDay[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseFaqs(raw?: string): FaqItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function initTourForm(tour?: any): TourFormData {
  return {
    title: tour?.title || '',
    slug: tour?.slug || '',
    shortDescription: tour?.shortDescription || '',
    fullDescription: tour?.fullDescription || '',
    durationDays: tour?.durationDays ?? 1,
    durationNights: tour?.durationNights ?? 0,
    priceUSD: tour?.priceUSD ?? 0,
    priceINR: tour?.priceINR?.toString() || '',
    priceEUR: tour?.priceEUR?.toString() || '',
    coverImageUrl: tour?.coverImageUrl || '',
    imageUrlsList: parseListField(tour?.imageUrls),
    difficulty: tour?.difficulty || 'Moderate',
    maxAltitude: tour?.maxAltitude || '',
    maxGroupSize: tour?.maxGroupSize?.toString() || '',
    isFeatured: tour?.isFeatured ?? false,
    isActive: tour?.isActive ?? true,
    seoTitle: tour?.seoTitle || '',
    seoDescription: tour?.seoDescription || '',
    highlightsList: parseListField(tour?.highlights),
    itineraryList: parseItinerary(tour?.itinerary),
    inclusionsList: parseListField(tour?.inclusions),
    exclusionsList: parseListField(tour?.exclusions),
    videoUrl: tour?.videoUrl || '',
    faqsList: parseFaqs(tour?.faqs),
    knowBeforeList: parseListField(tour?.knowBeforeYouGo),
  }
}

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
}) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items]
              next[i] = e.target.value
              onChange(next)
            }}
            style={{ flex: 1, padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            style={{ padding: '0.4rem 0.7rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        style={{ marginTop: '0.25rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: '1px dashed #CBD5E1', borderRadius: '6px', background: '#F8FAFC', cursor: 'pointer' }}
      >
        + Add item
      </button>
    </div>
  )
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

export default function TourForm({ initial, tourId }: { initial: TourFormData; tourId?: string }) {
  const router = useRouter()
  const params = useParams()
  const tenant = params.tenant as string
  const [form, setForm] = useState<TourFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [tenantSubdomain, setTenantSubdomain] = useState('')
  const [activeSection, setActiveSection] = useState<string>('general')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  function update(patch: Partial<TourFormData>) {
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
  useEffect(() => {
    api.get('/api/tenant/me')
      .then((res) => setTenantSubdomain(res.data.data.subdomain))
      .catch(() => {})
  }, [])

  function scrollToSection(id: string) {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      title: form.title,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      highlights: JSON.stringify(form.highlightsList.filter(Boolean)),
      itinerary: JSON.stringify(form.itineraryList),
      inclusions: JSON.stringify(form.inclusionsList.filter(Boolean)),
      exclusions: JSON.stringify(form.exclusionsList.filter(Boolean)),
      durationDays: Number(form.durationDays),
      durationNights: Number(form.durationNights),
      priceUSD: Number(form.priceUSD),
      priceINR: form.priceINR ? Number(form.priceINR) : null,
      priceEUR: form.priceEUR ? Number(form.priceEUR) : null,
      coverImageUrl: form.coverImageUrl,
      imageUrls: JSON.stringify(form.imageUrlsList.filter(Boolean)),
      difficulty: form.difficulty,
      maxAltitude: form.maxAltitude,
      maxGroupSize: form.maxGroupSize ? Number(form.maxGroupSize) : null,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      videoUrl: form.videoUrl,
      faqs: JSON.stringify(form.faqsList.filter((f) => f.question)),
      knowBeforeYouGo: JSON.stringify(form.knowBeforeList.filter(Boolean)),
    }

    try {
      if (tourId) {
        await api.put(`/api/tours/${tourId}`, payload)
      } else {
        await api.post('/api/tours', payload)
      }
      router.push(`/${tenant}/admin/tours`)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.875rem' }
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Sticky jump nav */}
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

      {/* General */}
      <SectionCard id="general" title="General" registerRef={(el) => (sectionRefs.current['general'] = el)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Title</label>
            <input value={form.title} onChange={(e) => update({ title: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Duration (Days)</label>
            <input type="number" value={form.durationDays} onChange={(e) => update({ durationDays: Number(e.target.value) })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Duration (Nights)</label>
            <input type="number" value={form.durationNights} onChange={(e) => update({ durationNights: Number(e.target.value) })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Price USD</label>
            <input type="number" step="0.01" value={form.priceUSD} onChange={(e) => update({ priceUSD: Number(e.target.value) })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Difficulty</label>
            <select value={form.difficulty} onChange={(e) => update({ difficulty: e.target.value })} style={inputStyle}>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
              <option value="Difficult">Difficult</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Price INR (optional)</label>
            <input type="number" value={form.priceINR} onChange={(e) => update({ priceINR: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Price EUR (optional)</label>
            <input type="number" value={form.priceEUR} onChange={(e) => update({ priceEUR: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Max Altitude</label>
            <input value={form.maxAltitude} onChange={(e) => update({ maxAltitude: e.target.value })} placeholder="e.g. 3,120 meters" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Max Group Size</label>
            <input type="number" value={form.maxGroupSize} onChange={(e) => update({ maxGroupSize: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => update({ isFeatured: e.target.checked })} /> Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => update({ isActive: e.target.checked })} /> Active
            </label>
          </div>
        </div>
      </SectionCard>

      {/* Content */}
      <SectionCard id="content" title="Content" registerRef={(el) => (sectionRefs.current['content'] = el)}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Short Description</label>
          <textarea value={form.shortDescription} onChange={(e) => update({ shortDescription: e.target.value })} style={{ ...inputStyle, minHeight: '70px' }} />
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Full Description</label>
          <RichTextEditor
            value={form.fullDescription}
            onChange={(html) => update({ fullDescription: html })}
            placeholder='Write the full tour description...'
          />
        </div>
        <div>
          <label style={labelStyle}>Highlights</label>
          <ListEditor items={form.highlightsList} onChange={(v) => update({ highlightsList: v })} placeholder="e.g. Exploring Tiger's Nest Monastery" />
        </div>
      </SectionCard>

      {/* Itinerary */}
      <SectionCard id="itinerary" title="Itinerary" registerRef={(el) => (sectionRefs.current['itinerary'] = el)}>
        {form.itineraryList.map((day, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
            <input
              type="number"
              value={day.day}
              onChange={(e) => {
                const next = [...form.itineraryList]
                next[i] = { ...next[i], day: Number(e.target.value) }
                update({ itineraryList: next })
              }}
              style={{ width: '70px', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
            />
            <input
              value={day.title}
              placeholder="Day title"
              onChange={(e) => {
                const next = [...form.itineraryList]
                next[i] = { ...next[i], title: e.target.value }
                update({ itineraryList: next })
              }}
              style={{ flex: '0 0 220px', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
            />
            <textarea
              value={day.description}
              placeholder="Description"
              onChange={(e) => {
                const next = [...form.itineraryList]
                next[i] = { ...next[i], description: e.target.value }
                update({ itineraryList: next })
              }}
              style={{ flex: 1, padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', minHeight: '52px' }}
            />
            <button
              type="button"
              onClick={() => update({ itineraryList: form.itineraryList.filter((_, idx) => idx !== i) })}
              style={{ padding: '0.4rem 0.7rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => update({ itineraryList: [...form.itineraryList, { day: form.itineraryList.length + 1, title: '', description: '' }] })}
          style={{ marginTop: '0.5rem', padding: '0.5rem 0.9rem', fontSize: '0.8rem', border: '1px dashed #CBD5E1', borderRadius: '6px', background: '#F8FAFC', cursor: 'pointer' }}
        >
          + Add Day
        </button>
      </SectionCard>

      {/* Inclusions & Exclusions */}
      <SectionCard id="inclusions" title="Inclusions & Exclusions" registerRef={(el) => (sectionRefs.current['inclusions'] = el)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <label style={labelStyle}>Inclusions</label>
            <ListEditor items={form.inclusionsList} onChange={(v) => update({ inclusionsList: v })} placeholder="e.g. All meals included" />
          </div>
          <div>
            <label style={labelStyle}>Exclusions</label>
            <ListEditor items={form.exclusionsList} onChange={(v) => update({ exclusionsList: v })} placeholder="e.g. International airfare" />
          </div>
        </div>
      </SectionCard>

      {/* Video, FAQs & Tips */}
      <SectionCard id="video-faqs" title="Video, FAQs & Tips" registerRef={(el) => (sectionRefs.current['video-faqs'] = el)}>
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={labelStyle}>Video URL (YouTube link or embed ID)</label>
          <input value={form.videoUrl} onChange={(e) => update({ videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=... or just the ID" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label style={labelStyle}>Know Before You Go</label>
          <ListEditor items={form.knowBeforeList} onChange={(v) => update({ knowBeforeList: v })} placeholder="e.g. Best time to visit is October to April" />
        </div>

        <div>
          <label style={labelStyle}>FAQs</label>
          {form.faqsList.map((faq, i) => (
            <div key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
              <input
                value={faq.question}
                placeholder="Question"
                onChange={(e) => {
                  const next = [...form.faqsList]
                  next[i] = { ...next[i], question: e.target.value }
                  update({ faqsList: next })
                }}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}
              />
              <textarea
                value={faq.answer}
                placeholder="Answer"
                onChange={(e) => {
                  const next = [...form.faqsList]
                  next[i] = { ...next[i], answer: e.target.value }
                  update({ faqsList: next })
                }}
                style={{ width: '100%', padding: '0.5rem 0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', minHeight: '60px' }}
              />
              <button
                type="button"
                onClick={() => update({ faqsList: form.faqsList.filter((_, idx) => idx !== i) })}
                style={{ marginTop: '0.5rem', padding: '0.3rem 0.7rem', fontSize: '0.75rem', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
              >
                Remove FAQ
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update({ faqsList: [...form.faqsList, { question: '', answer: '' }] })}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', border: '1px dashed #CBD5E1', borderRadius: '6px', background: '#F8FAFC', cursor: 'pointer' }}
          >
            + Add FAQ
          </button>
        </div>
      </SectionCard>

      {/* Media & SEO */}
      <SectionCard id="media-seo" title="Media & SEO" registerRef={(el) => (sectionRefs.current['media-seo'] = el)}>
        <div style={{ marginBottom: '1.25rem' }}>
          <ImageUpload
            label="Cover Image"
            value={form.coverImageUrl}
            onChange={(url) => update({ coverImageUrl: url })}
            folder="tours/cover"
            recommendedSize="1600 x 1067"
          />
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Gallery Images</label>
          <ListEditor items={form.imageUrlsList} onChange={(v) => update({ imageUrlsList: v })} placeholder="https://..." />
          <div style={{ marginTop: '0.6rem' }}>
            <ImageUpload
              label="Upload to Gallery"
              value=""
              onChange={(url) => update({ imageUrlsList: [...form.imageUrlsList, url] })}
              folder="tours/gallery"
              recommendedSize="1600 x 1067"
            />
          </div>
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <GoogleSearchPreview
            seoTitle={form.seoTitle}
            seoDescription={form.seoDescription}
            slug={form.slug}
            fallbackTitle={form.title}
            subdomain={tenantSubdomain}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>SEO Title</label>
          <input value={form.seoTitle} onChange={(e) => update({ seoTitle: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>SEO Description</label>
          <textarea value={form.seoDescription} onChange={(e) => update({ seoDescription: e.target.value })} style={{ ...inputStyle, minHeight: '80px' }} />
        </div>
      </SectionCard>

      {/* Sticky footer actions */}
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
          onClick={() => router.push(`/${tenant}/admin/tours`)}
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
          {saving ? 'Saving...' : tourId ? 'Save Changes' : 'Create Tour'}
        </button>
      </div>
    </div>
  )
}
