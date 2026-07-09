'use client'

import { Star } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

export default function Testimonials() {
  const { data } = useTenant()
  const testimonials = data?.testimonials?.slice(0, 3) || []

  if (testimonials.length === 0) return null

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {testimonials.map((t) => (
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
    </section>
  )
}
