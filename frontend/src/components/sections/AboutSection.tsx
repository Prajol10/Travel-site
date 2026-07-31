'use client'

import Link from 'next/link'
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
        <div className="grid lg:grid-cols-[5fr_6fr] gap-16 lg:gap-24 items-center">
          {/* Image side */}
          <div className="relative min-w-0">
            <div
              className="overflow-hidden relative"
              style={{ borderRadius: '24px', aspectRatio: '4 / 3.6', boxShadow: '0 24px 60px rgba(27, 43, 75, 0.18)' }}
            >
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-7 leading-tight break-words">
              {section?.title || 'Journey with Passion & Experience'}
            </h2>
            <div
              className="about-body text-gray-600 text-lg mb-10"
              style={{ lineHeight: 1.85 }}
              dangerouslySetInnerHTML={{
                __html: section?.body ||
                  'We have been guiding travelers to sacred and breathtaking destinations for years, committed to providing safe, enriching, and memorable travel experiences.',
              }}
            />
            <style jsx>{`
              .about-body :global(strong) {
                display: block;
                color: var(--navy);
                font-size: 1.2rem;
                font-weight: 700;
                margin-top: 1.75rem;
                margin-bottom: 0.6rem;
              }
              .about-body :global(p) {
                margin-bottom: 1rem;
              }
            `}</style>

            <div
              className="flex flex-wrap gap-10 pb-9"
              style={{ borderBottom: '1px solid #EEEAE0', marginTop: '0.5rem', marginBottom: '2.5rem' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--gold-pale)' }}
                >
                  <Award size={26} className="text-gold" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-bold text-navy text-base mb-1">Award Winning</div>
                  <div className="text-gray-500 text-sm">Best Adventure Operator</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--gold-pale)' }}
                >
                  <Leaf size={26} className="text-gold" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-bold text-navy text-base mb-1">Eco-Friendly</div>
                  <div className="text-gray-500 text-sm">Sustainable tourism</div>
                </div>
              </div>
            </div>

            <Link
              href={tenantUrl(tenant?.subdomain, section?.ctaUrl || '/about')}
              className="btn-gold"
              style={{ display: 'inline-flex', padding: '0.9rem 2.2rem' }}
            >
              {section?.ctaText || 'Learn More About Us'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
