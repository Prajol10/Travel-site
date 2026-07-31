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
        <div className="text-center mb-10">
          <div className="section-label justify-center mb-5">Travel Insights</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-5">Latest from Our Blog</h2>
          <p className="text-gray-500" style={{ maxWidth: '34rem', margin: '0 auto', textAlign: 'center' }}>
            Expert tips, travel guides, and stories to help you plan your perfect adventure
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-stretch gap-9">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={tenantUrl(tenant?.subdomain, `/blog/${post.slug}`)}
              className="card block flex flex-col"
              style={{ width: '480px', flex: '0 1 480px', transition: 'transform 0.25s ease, box-shadow 0.25s ease', overflow: 'hidden' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'
                const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
                if (img) img.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
                const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
                if (img) img.style.transform = 'scale(1)'
              }}
            >
              <div className="overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
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
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-5" style={{ fontSize: '0.75rem' }}>
                  <span className="text-gold font-semibold">{post.category || 'Travel Tips'}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400">{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-navy mb-5 leading-snug line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-500 text-sm mb-7 line-clamp-2" style={{ lineHeight: 1.7 }}>{post.excerpt}</p>
                )}
                <div
                  className="flex items-center gap-1.5 text-gold font-semibold text-sm"
                  style={{ marginTop: 'auto', transition: 'gap 0.2s ease' }}
                >
                  Read More <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-24">
          <Link href={tenantUrl(tenant?.subdomain, '/blog')} className="btn-outline-gold">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}
