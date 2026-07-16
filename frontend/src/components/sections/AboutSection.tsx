'use client'

import { Award, Leaf } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'
import { getContentSection } from '@/lib/utils'

export default function AboutSection() {
  const { data, tenant } = useTenant()
  const section = getContentSection(data?.content || [], 'AboutUs')
  const gallery = data?.gallery?.slice(0, 4) || []

  return (
    <section className="section bg-white overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative min-w-0">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
              {section?.imageUrl ? (
                <img
                  src={section.imageUrl}
                  alt="About us"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
            </div>

            {section?.secondaryImageUrl && (
              <div className="absolute -top-8 -right-4 w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                <img
                  src={section.secondaryImageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {gallery.length > 0 && (
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-xl p-3 grid grid-cols-4 gap-2 shadow-xl">
                {gallery.map((g) => (
                  <div key={g.id} className="aspect-square rounded-lg overflow-hidden">
                    <img src={g.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Text side */}
          <div className="min-w-0">
            <div className="section-label-left mb-5">About Us</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight break-words">
              {section?.title || 'Journey with Passion & Experience'}
            </h2>
            <div
              className="text-gray-600 leading-relaxed mb-8 text-lg"
              dangerouslySetInnerHTML={{
                __html: section?.body ||
                  'We have been guiding travelers to sacred and breathtaking destinations for years, committed to providing safe, enriching, and memorable travel experiences.',
              }}
            />

            <div className="flex gap-10 mb-9">
              <div className="flex items-center gap-3">
                <Award size={28} className="text-gold" strokeWidth={1.5} />
                <div>
                  <div className="font-bold text-navy text-sm">Award Winning</div>
                  <div className="text-gray-500 text-xs">Best Adventure Operator</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Leaf size={28} className="text-gold" strokeWidth={1.5} />
                <div>
                  <div className="font-bold text-navy text-sm">Eco-Friendly</div>
                  <div className="text-gray-500 text-xs">Sustainable tourism</div>
                </div>
              </div>
            </div>

            <a href={tenantUrl(tenant?.subdomain, section?.ctaUrl || '/about')} className="btn-gold">
              {section?.ctaText || 'Learn More About Us'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
