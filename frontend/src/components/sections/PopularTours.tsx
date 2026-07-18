'use client'
import { useMemo, useState } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'
import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/lib/utils'

export default function PopularTours() {
  const { data, tenant } = useTenant()
  const { currency } = useCurrency()
  const allTours = data?.tours || []

  const categories = useMemo(() => {
    const names = new Set<string>()
    allTours.forEach((t) => { if (t.categoryName) names.add(t.categoryName) })
    return Array.from(names)
  }, [allTours])

  const hasFeatured = allTours.some((t) => t.isFeatured)
  const tabs = [hasFeatured ? 'Best Sellers' : null, ...categories].filter(Boolean) as string[]
  const [activeTab, setActiveTab] = useState(tabs[0] || '')

  const tours = useMemo(() => {
    const filtered = activeTab === 'Best Sellers'
      ? allTours.filter((t) => t.isFeatured)
      : allTours.filter((t) => t.categoryName === activeTab)
    return filtered.slice(0, 4)
  }, [allTours, activeTab])

  if (allTours.length === 0) return null

  return (
    <section className="section-sm bg-off-white" style={{ background: '#FAF9F6' }}>
      <div className="container">
        <div className="text-center mb-10">
          <div className="section-label justify-center mb-5">Popular Tours</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Explore Our Top Journeys</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Hand-picked adventures chosen by travelers for unforgettable experiences
          </p>
        </div>

        {tabs.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid #E5E1D8' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 0 0.9rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: activeTab === tab ? 'var(--navy)' : '#94A3B8',
                  borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'color 0.2s ease',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {tours.length === 0 ? (
          <div className="text-center text-gray-400">No tours in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {tours.map((tour) => (
              <a key={tour.id} href={tenantUrl(tenant?.subdomain, `/tours/${tour.slug}`)} className="tour-card block">
                <div className="relative h-56 overflow-hidden">
                  {tour.coverImageUrl ? (
                    <img
                      src={tour.coverImageUrl}
                      alt={tour.title}
                      className="tour-card-img w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium">
                    <MapPin size={13} />
                    {tour.categoryName || 'Adventure Tour'}
                  </div>
                </div>
                <div className="p-5" style={{ paddingRight: '1.75rem' }}>
                  <h3 className="font-serif font-bold text-lg text-navy mb-3 leading-snug line-clamp-2">
                    {tour.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Clock size={14} />
                      {tour.durationDays} Days
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-gray-400">From</div>
                      <div className="font-bold text-gold">
                        {formatPrice(tour.priceUSD, tour.priceINR, tour.priceEUR, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a href={tenantUrl(tenant?.subdomain, '/tours')} className="btn-outline-gold">
            View All Tour Packages
          </a>
        </div>
      </div>
    </section>
  )
}
