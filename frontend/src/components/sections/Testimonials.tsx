'use client'
import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

const PER_PAGE = 3

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
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-5">Testimonials</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {visible.map((t) => (
              <div key={t.id} className="card p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.round(t.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  {t.sourcePlatform && (
                    <span className="text-xs text-gray-400 font-medium">{t.sourcePlatform}</span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  "{t.reviewText}"
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {t.authorPhotoUrl ? (
                      <img src={t.authorPhotoUrl} alt={t.authorName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gold-pale text-gold font-bold">
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
