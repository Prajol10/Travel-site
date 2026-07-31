'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-5">Explore Our Top Journeys</h2>
          <p className="text-gray-500" style={{ maxWidth: '34rem', margin: '0 auto', textAlign: 'center' }}>
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              alignItems: 'stretch',
            }}
          >
            {tours.map((tour) => (
              <div key={tour.id} style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
                <Link
                  href={tenantUrl(tenant?.subdomain, `/tours/${tour.slug}`)}
                  className="block flex flex-col h-full"
                  style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    background: '#ffffff',
                    boxShadow: '0 10px 30px rgba(27, 43, 75, 0.08)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 24px 46px rgba(27, 43, 75, 0.15)'
                    const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
                    if (img) img.style.transform = 'scale(1.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(27, 43, 75, 0.08)'
                    const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
                    if (img) img.style.transform = 'scale(1)'
                  }}
                >
                  <div className="relative overflow-hidden" style={{ height: '200px' }}>
                    {tour.coverImageUrl ? (
                      <img
                        src={tour.coverImageUrl}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                        style={{ transition: 'transform 0.35s ease' }}
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div
                      className="absolute flex items-center gap-1.5 text-white text-xs font-medium"
                      style={{ bottom: '14px', left: '14px' }}
                    >
                      <MapPin size={13} />
                      {tour.categoryName || 'Adventure Tour'}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col" style={{ padding: '1.5rem 1.5rem 1.75rem' }}>
                    <h3
                      className="font-serif font-bold text-navy leading-snug mb-5"
                      style={{
                        fontSize: '1.15rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                      }}
                    >
                      {tour.title}
                    </h3>
                    <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock size={14} />
                        {tour.durationDays} Days
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400" style={{ fontSize: '0.72rem', marginBottom: '2px' }}>From</div>
                        <div className="font-bold text-gold" style={{ fontSize: '1.05rem' }}>
                          {formatPrice(tour.priceUSD, tour.priceINR, tour.priceEUR, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="text-center" style={{ marginTop: '40px' }}>
          <Link href={tenantUrl(tenant?.subdomain, '/tours')} className="btn-outline-gold">
            View All Tour Packages
          </Link>
        </div>
      </div>
    </section>
  )
}
