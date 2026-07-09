'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTenant } from '@/context/TenantContext'
import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/lib/utils'
import api from '@/lib/api'
import { Eye, Bookmark, Feather, Info, Map as MapIcon, Video as VideoIcon, HelpCircle, Star, Clock, Mountain, Users, MapPin, ChevronDown, Download } from 'lucide-react'

function parseList(raw?: string): string[] {
  if (!raw) return []
  try {
    const p = JSON.parse(raw)
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

function parseItinerary(raw?: string): { day: number; title: string; description: string }[] {
  if (!raw) return []
  try {
    const p = JSON.parse(raw)
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

function parseFaqs(raw?: string): { question: string; answer: string }[] {
  if (!raw) return []
  try {
    const p = JSON.parse(raw)
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

function getYouTubeEmbedUrl(input?: string): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return `https://www.youtube.com/embed/${trimmed}`
  const match = trimmed.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

const sections = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'itinerary', label: 'Itinerary', icon: Feather },
  { id: 'inclusions', label: 'Inclusions', icon: Bookmark },
  { id: 'know-before', label: 'Know Before', icon: Info },
  { id: 'map', label: 'Map', icon: MapIcon },
  { id: 'video', label: 'Video', icon: VideoIcon },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'reviews', label: 'Reviews', icon: Star },
] as const

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #E5E1D8' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>{question}</span>
        <ChevronDown size={18} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--gold)', flexShrink: 0 }} />
      </button>
      {open && <p style={{ color: 'var(--gray-600)', paddingBottom: '1rem', lineHeight: 1.6 }}>{answer}</p>}
    </div>
  )
}

export default function TourDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { tenant } = useTenant()
  const { currency } = useCurrency()

  const [tour, setTour] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [subNavFixed, setSubNavFixed] = useState(false)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    if (!tenant?.id) return
    api.get(`/api/tours/${tenant.id}/slug/${slug}`)
      .then((res) => {
        const t = res.data.data
        setTour(t)
        if (t.categoryId) {
          api.get(`/api/tours/${tenant.id}`, { params: { categoryId: t.categoryId } })
            .then((r) => setSimilar(r.data.data.filter((s: any) => s.slug !== slug).slice(0, 4)))
        }
        api.get(`/api/testimonials/${tenant.id}`)
          .then((r) => setReviews(r.data.data.filter((rv: any) => rv.tourName === t.title)))
      })
      .finally(() => setLoading(false))
  }, [tenant?.id, slug])

  useEffect(() => {
    if (!tour) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 }
    )
    sections.forEach((s) => {
      const el = sectionRefs.current[s.id]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [tour])

  useEffect(() => {
    const onScroll = () => setSubNavFixed(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToSection(id: string) {
    const el = sectionRefs.current[id]
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 130
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  async function handleEnquiry(e: React.FormEvent) {
    e.preventDefault()
    if (!tenant?.id) return
    await api.post(`/api/leads/${tenant.id}`, { ...form, tourInterest: tour?.title, source: 'tour_detail_page' })
    setSent(true)
  }

  async function handleDownloadPdf() {
    if (!tour) return
    setGeneratingPdf(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const margin = 48
      let y = margin

      doc.setFontSize(20)
      doc.text(tour.title, margin, y)
      y += 28

      doc.setFontSize(11)
      doc.setTextColor(100)
      doc.text(`${tour.durationDays} Days / ${tour.durationNights} Nights  •  ${tour.difficulty}  •  ${formatPrice(tour.priceUSD, tour.priceINR, tour.priceEUR, currency)}`, margin, y)
      y += 28

      if (tour.shortDescription) {
        doc.setTextColor(20)
        const lines = doc.splitTextToSize(tour.shortDescription, 500)
        doc.text(lines, margin, y)
        y += lines.length * 14 + 16
      }

      const highlights = parseList(tour.highlights)
      if (highlights.length > 0) {
        doc.setFontSize(14)
        doc.text('Highlights', margin, y)
        y += 18
        doc.setFontSize(10)
        highlights.forEach((h: string) => {
          const lines = doc.splitTextToSize(`• ${h}`, 500)
          if (y > 750) { doc.addPage(); y = margin }
          doc.text(lines, margin, y)
          y += lines.length * 13 + 4
        })
        y += 12
      }

      const itinerary = parseItinerary(tour.itinerary)
      if (itinerary.length > 0) {
        if (y > 700) { doc.addPage(); y = margin }
        doc.setFontSize(14)
        doc.text('Itinerary', margin, y)
        y += 18
        doc.setFontSize(10)
        itinerary.forEach((d) => {
          if (y > 750) { doc.addPage(); y = margin }
          doc.setFont('helvetica', 'bold')
          doc.text(`Day ${d.day}: ${d.title}`, margin, y)
          y += 14
          doc.setFont('helvetica', 'normal')
          const lines = doc.splitTextToSize(d.description, 500)
          doc.text(lines, margin, y)
          y += lines.length * 13 + 10
        })
      }

      doc.save(`${tour.slug}-itinerary.pdf`)
    } finally {
      setGeneratingPdf(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--gray-500)' }}>Loading tour...</div>
  }
  if (!tour) {
    return <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--gray-500)' }}>Tour not found.</div>
  }

  const highlights = parseList(tour.highlights)
  const itinerary = parseItinerary(tour.itinerary)
  const inclusions = parseList(tour.inclusions)
  const exclusions = parseList(tour.exclusions)
  const knowBefore = parseList(tour.knowBeforeYouGo)
  const faqs = parseFaqs(tour.faqs)
  const videoEmbedUrl = getYouTubeEmbedUrl(tour.videoUrl)
  const mapQuery = encodeURIComponent(`${tour.title} ${tenant?.address || ''}`)

  return (
    <>
      <div style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
        <img
          src={tour.coverImageUrl || 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=2070&auto=format&fit=crop'}
          alt={tour.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,43,75,0.9), rgba(27,43,75,0.25))' }} />
        <div className="container" style={{ position: 'absolute', bottom: '1.75rem', left: 0, right: 0 }}>
          {tour.isFeatured && (
            <div style={{ display: 'inline-block', background: 'var(--gold)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: '999px', marginBottom: '0.75rem' }}>
              Most Popular
            </div>
          )}
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, color: '#ffffff' }}>
            {tour.title}
          </h1>
          {tour.categoryName && <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '0.4rem' }}>{tour.categoryName}</p>}
        </div>
      </div>

      {subNavFixed && <div style={{ height: '58px' }} />}
      <div style={{
        position: subNavFixed ? 'fixed' : 'relative',
        top: subNavFixed ? '80px' : 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: '#fff',
        borderBottom: '1px solid #E5E1D8',
        boxShadow: subNavFixed ? '0 2px 12px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div className="container" style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
          {sections.map((s) => {
            const Icon = s.icon
            const active = activeSection === s.id
            return (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '1rem 1.1rem',
                  background: active ? 'var(--navy)' : 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                  color: active ? '#fff' : 'var(--gray-600)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} /> {s.label}
              </button>
            )
          })}
        </div>
      </div>

      <section style={{ padding: '3rem 0', background: '#FAF9F6' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'flex-start' }}>
          <div>
            {tour.shortDescription && (
              <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>{tour.shortDescription}</p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', background: '#EFF3FA', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.8rem', marginBottom: '0.25rem' }}><Clock size={14} /> Duration</div>
                <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{tour.durationDays} Days / {tour.durationNights} Nights</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.8rem', marginBottom: '0.25rem' }}><Star size={14} /> Difficulty</div>
                <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{tour.difficulty}</div>
              </div>
              {tour.maxAltitude && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.8rem', marginBottom: '0.25rem' }}><Mountain size={14} /> Max Altitude</div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{tour.maxAltitude}</div>
                </div>
              )}
              {tour.maxGroupSize && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.8rem', marginBottom: '0.25rem' }}><Users size={14} /> Group Size</div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Up to {tour.maxGroupSize}</div>
                </div>
              )}
            </div>

            <section id="overview" ref={(el) => { sectionRefs.current['overview'] = el }} style={{ marginBottom: '3rem', scrollMarginTop: '150px' }}>
              {highlights.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>Highlights</h2>
                  {highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>›</span>
                      <span style={{ color: 'var(--gray-600)' }}>{h}</span>
                    </div>
                  ))}
                </div>
              )}
              {tour.fullDescription && (
                <div
                  className='tour-full-description'
                  style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: tour.fullDescription }}
                />
              )}
            </section>

            <section id="itinerary" ref={(el) => { sectionRefs.current['itinerary'] = el }} style={{ marginBottom: '3rem', scrollMarginTop: '150px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>Itinerary</h2>
              {itinerary.length === 0 ? (
                <p style={{ color: 'var(--gray-500)' }}>Itinerary coming soon.</p>
              ) : (
                <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1.5rem' }}>
                  {itinerary.map((d, i) => (
                    <div key={i} style={{ marginBottom: '1.75rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-1.95rem', top: '0.15rem', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gold)' }} />
                      <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '0.3rem' }}>Day {d.day}: {d.title}</div>
                      <div style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>{d.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section id="inclusions" ref={(el) => { sectionRefs.current['inclusions'] = el }} style={{ marginBottom: '3rem', scrollMarginTop: '150px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>Inclusions & Exclusions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '0.75rem' }}>Included</h3>
                  {inclusions.length === 0 ? <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Not specified.</p> : inclusions.map((item, i) => (
                    <div key={i} style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>✓ {item}</div>
                  ))}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '0.75rem' }}>Not Included</h3>
                  {exclusions.length === 0 ? <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Not specified.</p> : exclusions.map((item, i) => (
                    <div key={i} style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>✕ {item}</div>
                  ))}
                </div>
              </div>
            </section>

            <section id="know-before" ref={(el) => { sectionRefs.current['know-before'] = el }} style={{ marginBottom: '3rem', scrollMarginTop: '150px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>Know Before You Go</h2>
              {knowBefore.length === 0 ? (
                <p style={{ color: 'var(--gray-500)' }}>No travel tips added yet.</p>
              ) : (
                knowBefore.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem', padding: '0.9rem 1rem', background: '#fff', borderRadius: '8px', border: '1px solid #E5E1D8' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>ℹ</span>
                    <span style={{ color: 'var(--gray-600)' }}>{tip}</span>
                  </div>
                ))
              )}
            </section>

            <section id="map" ref={(el) => { sectionRefs.current['map'] = el }} style={{ marginBottom: '3rem', scrollMarginTop: '150px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>Map</h2>
              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E1D8' }}>
                <iframe
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  style={{ width: '100%', height: '320px', border: 'none' }}
                  loading="lazy"
                />
              </div>
            </section>

            <section id="video" ref={(el) => { sectionRefs.current['video'] = el }} style={{ marginBottom: '3rem', scrollMarginTop: '150px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>Video</h2>
              {videoEmbedUrl ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '10px', overflow: 'hidden' }}>
                  <iframe
                    src={videoEmbedUrl}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p style={{ color: 'var(--gray-500)' }}>No video added yet.</p>
              )}
            </section>

            <section id="faqs" ref={(el) => { sectionRefs.current['faqs'] = el }} style={{ marginBottom: '3rem', scrollMarginTop: '150px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>FAQs</h2>
              {faqs.length === 0 ? (
                <p style={{ color: 'var(--gray-500)' }}>No FAQs added yet.</p>
              ) : (
                faqs.map((faq, i) => <FaqAccordionItem key={i} question={faq.question} answer={faq.answer} />)
              )}
            </section>

            <section id="reviews" ref={(el) => { sectionRefs.current['reviews'] = el }} style={{ scrollMarginTop: '150px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>Reviews</h2>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--gray-500)' }}>No reviews for this tour yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} style={{ background: '#fff', border: '1px solid #E5E1D8', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      {r.authorPhotoUrl && <img src={r.authorPhotoUrl} alt={r.authorName} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />}
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>{r.authorName}</div>
                        <div style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      </div>
                    </div>
                    <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>{r.reviewText}</p>
                  </div>
                ))
              )}
            </section>
          </div>

          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(27,43,75,0.08)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Price Per Person</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.75rem' }}>
                {formatPrice(tour.priceUSD, tour.priceINR, tour.priceEUR, currency)}
              </div>
              {tour.rating && (
                <div style={{ color: 'var(--gold)', marginBottom: '1rem' }}>
                  {'★'.repeat(Math.round(tour.rating))}{'☆'.repeat(5 - Math.round(tour.rating))}
                </div>
              )}
              {tenant?.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <MapPin size={14} /> {tenant.address}
                </div>
              )}

              <button
                onClick={() => setShowEnquiry(true)}
                style={{ width: '100%', padding: '0.8rem', background: 'var(--navy)', color: '#fff', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '0.6rem' }}
              >
                Enquire Now
              </button>
              {tenant?.whatsAppNumber && (
                
                <a
                  href={`https://wa.me/${tenant.whatsAppNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  style={{ display: 'block', textAlign: 'center', width: '100%', padding: '0.8rem', background: 'var(--gold)', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', marginBottom: '0.6rem' }}
                >
                  WhatsApp Us
                </a>
              )}
              <button
                onClick={handleDownloadPdf}
                disabled={generatingPdf}
                style={{ width: '100%', padding: '0.8rem', background: '#fff', color: 'var(--navy)', fontWeight: 700, borderRadius: '8px', border: '1px solid var(--navy)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: generatingPdf ? 0.6 : 1 }}
              >
                <Download size={16} /> {generatingPdf ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {showEnquiry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,43,75,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '2rem', width: '420px' }}>
            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>Thank you!</h3>
                <p style={{ color: 'var(--gray-500)', marginBottom: '1.25rem' }}>We'll get back to you shortly about {tour.title}.</p>
                <button onClick={() => { setShowEnquiry(false); setSent(false) }} style={{ padding: '0.6rem 1.25rem', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleEnquiry}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '1rem' }}>Enquire About This Tour</h3>
                <input required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} style={{ width: '100%', padding: '0.65rem', border: '1px solid #D9D5C9', borderRadius: '8px', marginBottom: '0.75rem', fontSize: '0.9rem' }} />
                <input placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} style={{ width: '100%', padding: '0.65rem', border: '1px solid #D9D5C9', borderRadius: '8px', marginBottom: '0.75rem', fontSize: '0.9rem' }} />
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '0.65rem', border: '1px solid #D9D5C9', borderRadius: '8px', marginBottom: '0.75rem', fontSize: '0.9rem' }} />
                <textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ width: '100%', padding: '0.65rem', border: '1px solid #D9D5C9', borderRadius: '8px', marginBottom: '1rem', minHeight: '80px', fontSize: '0.9rem' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setShowEnquiry(false)} style={{ flex: 1, padding: '0.65rem', border: '1px solid #D9D5C9', borderRadius: '8px', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '0.65rem', border: 'none', borderRadius: '8px', background: 'var(--gold)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Send</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <section style={{ padding: '3rem 0 4rem', background: '#FAF9F6', borderTop: '1px solid #E5E1D8' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>Similar Trips</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {similar.map((s) => (
                <a key={s.id} href={`/tours/${s.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ height: '160px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.6rem' }}>
                    <img src={s.coverImageUrl || 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=2070&auto=format&fit=crop'} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{s.title}</div>
                  <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>{formatPrice(s.priceUSD, s.priceINR, s.priceEUR, currency)}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
