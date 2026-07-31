'use client'
import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

const PER_PAGE = 3
const CLAMP_LINES = 6

function TestimonialCard({ t }: { t: any }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = (t.reviewText || '').length > 220

  return (
    <div
      className="card p-10 flex flex-col h-full"
      style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div className="flex items-center justify-between mb-7">
        <div className="stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} fill={i < Math.round(t.rating) ? 'currentColor' : 'none'} />
          ))}
        </div>
        {t.sourcePlatform && (
          <span
            className="text-xs text-gray-500 font-medium"
            style={{ background: '#F5F3EE', padding: '4px 12px', borderRadius: '999px' }}
          >
            {t.sourcePlatform}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p
          className="text-gray-600 text-base"
          style={{
            lineHeight: 1.75,
            ...(expanded
              ? {}
              : { display: '-webkit-box', WebkitLineClamp: CLAMP_LINES, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }),
          }}
        >
          "{t.reviewText}"
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, alignSelf: 'flex-start' }}
          >
            {expanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 pt-7 mt-7 border-t border-gray-100">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {t.authorPhotoUrl ? (
            <img src={t.authorPhotoUrl} alt={t.authorName} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold"
              style={{ background: 'var(--navy)', color: 'var(--gold)' }}
            >
              {t.authorName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <div className="font-semibold text-navy text-sm">{t.authorName}</div>
          <div className="text-xs text-gray-400">
            {t.authorLocation} {t.tourName ? `· ${t.tourName}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { data } = useTenant()
  const testimonials = data?.testimonials || []
  const [page, setPage] = useState(0)

  if (testimonials.length === 0) return null

  const pageCount = Math.ceil(testimonials.length / PER_PAGE)
  const visible = testimonials.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  function prev() {
    setPage((p) => (p - 1 + pageCount) % pageCount)
  }
  function next() {
    setPage((p) => (p + 1) % pageCount)
  }

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <div className="section-label justify-center mb-5">Testimonials</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-5">What Our Travelers Say</h2>
          <p className="text-gray-500" style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'center' }}>
            Real experiences from travelers who journeyed with us
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {pageCount > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous testimonials"
                style={{
                  position: 'absolute', left: '-1.25rem', top: '50%', transform: 'translateY(-50%)',
                  width: '2.75rem', height: '2.75rem', borderRadius: '50%', border: '1px solid #E5E1D8',
                  background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                className="hidden md:flex"
              >
                <ChevronLeft size={20} color="var(--navy)" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonials"
                style={{
                  position: 'absolute', right: '-1.25rem', top: '50%', transform: 'translateY(-50%)',
                  width: '2.75rem', height: '2.75rem', borderRadius: '50%', border: '1px solid #E5E1D8',
                  background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                className="hidden md:flex"
              >
                <ChevronRight size={20} color="var(--navy)" />
              </button>
            </>
          )}

          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 440px))', justifyContent: 'center', alignItems: 'stretch' }}
          >
            {visible.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>

        {pageCount > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                style={{
                  width: i === page ? '1.5rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '999px',
                  background: i === page ? 'var(--gold)' : '#E5E1D8',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'width 0.2s ease, background 0.2s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
