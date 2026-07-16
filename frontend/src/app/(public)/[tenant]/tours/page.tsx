'use client'

import { Suspense } from 'react'
import { useTenant } from '@/context/TenantContext'
import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/lib/utils'
import { Clock, MapPin } from 'lucide-react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { tenantUrl } from '@/lib/utils'

function ToursContent() {
  const { data } = useTenant()
  const { currency } = useCurrency()
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const tenantSlug = params.tenant as string

  const allTours = data?.tours || []
  const featuredOnly = searchParams.get('featured') === 'true'

  const tours = featuredOnly
    ? allTours.filter((tour) => tour.isFeatured)
    : allTours

  function goToFilter(featured: boolean) {
    if (featured) {
      router.push(tenantUrl(tenantSlug, '/tours?featured=true'))
    } else {
      router.push(tenantUrl(tenantSlug, '/tours'))
    }
  }

  return (
    <>
      <div style={{ paddingTop: '80px', background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Our Tours</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            All Tour Packages
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
            Discover our carefully curated collection of Himalayan adventures
          </p>
        </div>
      </div>

      <section style={{ padding: '80px 0', background: '#FAF9F6' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <button
              onClick={() => goToFilter(false)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '999px',
                border: '1px solid var(--navy)',
                background: !featuredOnly ? 'var(--navy)' : 'transparent',
                color: !featuredOnly ? '#ffffff' : 'var(--navy)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              All Tours
            </button>
            <button
              onClick={() => goToFilter(true)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '999px',
                border: '1px solid var(--gold)',
                background: featuredOnly ? 'var(--gold)' : 'transparent',
                color: featuredOnly ? '#ffffff' : 'var(--gold)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Featured
            </button>
          </div>

          {tours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-500)' }}>
              <p style={{ fontSize: '1.1rem' }}>
                {featuredOnly ? 'No featured tours available yet.' : 'No tours available yet. Check back soon!'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {tours.map((tour) => (
                <a key={tour.id} href={tenantUrl(tenantSlug, `/tours/${tour.slug}`)} className="tour-card" style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    {tour.coverImageUrl ? (
                      <img
                        src={tour.coverImageUrl}
                        alt={tour.title}
                        className="tour-card-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#ffffff', fontSize: '0.75rem', fontWeight: 500 }}>
                      <MapPin size={12} /> {tour.categoryName || 'Himalayan Tour'}
                    </div>
                    {tour.isFeatured && (
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--gold)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                        Featured
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                      {tour.title}
                    </h3>
                    {tour.shortDescription && (
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {tour.shortDescription}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                        <Clock size={14} /> {tour.durationDays} Days
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>From</div>
                        <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '1rem' }}>
                          {formatPrice(tour.priceUSD, tour.priceINR, tour.priceEUR, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function ToursPage() {
  return (
    <Suspense fallback={null}>
      <ToursContent />
    </Suspense>
  )
}
