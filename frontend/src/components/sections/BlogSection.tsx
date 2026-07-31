'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export default function BlogSection() {
  const { data, tenant } = useTenant()
  const posts = data?.blogs?.slice(0, 3) || []
  if (posts.length === 0) return null
  return (
    <section className="section" style={{ background: '#FAF9F6' }}>
      <div className="container">
        <div className="text-center mb-8">
          <div
            className="section-label justify-center mb-5"
            style={{ fontWeight: 700, letterSpacing: '0.2em', color: 'var(--gold-dark)' }}
          >
            Travel Insights
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-5">Latest from Our Blog</h2>
          <p className="text-gray-500" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
            Expert tips, travel guides, and stories to help you plan your perfect adventure
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              href={tenantUrl(tenant?.subdomain, `/blog/${post.slug}`)}
              className="flex flex-col h-full"
              style={{
                width: '100%',
                maxWidth: '740px',
                margin: '0 auto',
                overflow: 'hidden',
                borderRadius: '20px',
                background: '#ffffff',
                boxShadow: '0 10px 34px rgba(27, 43, 75, 0.10)',
                border: '1px solid #EFEBE2',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 26px 50px rgba(27, 43, 75, 0.16)'
                const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
                if (img) img.style.transform = 'scale(1.06)'
                const arrow = e.currentTarget.querySelector('.read-more-arrow') as HTMLElement | null
                if (arrow) arrow.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 34px rgba(27, 43, 75, 0.10)'
                const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
                if (img) img.style.transform = 'scale(1)'
                const arrow = e.currentTarget.querySelector('.read-more-arrow') as HTMLElement | null
                if (arrow) arrow.style.transform = 'translateX(0)'
              }}
            >
              <div className="overflow-hidden flex-shrink-0" style={{ height: '240px' }}>
                {post.coverImageUrl ? (
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    style={{ transition: 'transform 0.35s ease' }}
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
                )}
              </div>
              <div className="flex-1 flex flex-col" style={{ padding: '2rem 2rem 2.5rem' }}>
                <div className="flex items-center gap-2 mb-6">
                  <span
                    className="font-bold"
                    style={{ color: 'var(--gold-dark)', fontSize: '0.8rem', letterSpacing: '0.03em' }}
                  >
                    {post.category || 'Travel Tips'}
                  </span>
                  <span style={{ color: '#D8D2C4' }}>•</span>
                  <span style={{ color: '#8B93A3', fontSize: '0.8rem' }}>
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>
                <h3
                  className="font-serif font-bold text-navy mb-4"
                  style={{
                    fontSize: '1.4rem',
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p
                    className="text-gray-500 text-sm mb-7"
                    style={{
                      lineHeight: 1.75,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}
                <div
                  className="flex items-center gap-1.5 font-semibold text-sm"
                  style={{ marginTop: 'auto', color: 'var(--gold-dark)' }}
                >
                  Read More
                  <ArrowRight size={14} className="read-more-arrow" style={{ transition: 'transform 0.25s ease' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '38px' }}>
          <Link href={tenantUrl(tenant?.subdomain, '/blog')} className="btn-outline-gold">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}
