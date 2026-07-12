'use client'

import { Clock, MapPin } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'
import { useCurrency } from '@/context/CurrencyContext'
import { formatPrice } from '@/lib/utils'

export default function PopularTours() {
  const { data, tenant } = useTenant()
  const { currency } = useCurrency()
  const tours = data?.tours?.slice(0, 4) || []

  if (tours.length === 0) return null

  return (
    <section className="section bg-off-white" style={{ background: '#FAF9F6' }}>
      <div className="container">
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-5">Popular Tours</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Explore Our Top Journeys</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Hand-picked adventures chosen by travelers for unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {tours.map((tour) => (
            <a key={tour.id} href={tenantUrl(tenant?.subdomain, `/tours/${tour.slug}`)} className="tour-card block">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tour.coverImageUrl || 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=2070&auto=format&fit=crop'}
                  alt={tour.title}
                  className="tour-card-img w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium">
                  <MapPin size={13} />
                  {tour.categoryName || 'Adventure Tour'}
                </div>
              </div>

              <div className="p-5">
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

        <div className="text-center mt-14">
          <a href={tenantUrl(tenant?.subdomain, '/tours')} className="btn-outline-gold">
            View All Tour Packages
          </a>
        </div>
      </div>
    </section>
  )
}
