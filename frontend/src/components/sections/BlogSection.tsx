'use client'

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
        <div className="text-center mb-14">
          <div className="section-label justify-center mb-5">Travel Insights</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Expert tips, travel guides, and stories to help you plan your perfect adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {posts.map((post) => (
            <a key={post.id} href={tenantUrl(tenant?.subdomain, `/blog/${post.slug}`)} className="card block">
              <div className="h-52 overflow-hidden">
                {post.coverImageUrl ? (
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs mb-3">
                  <span className="text-gold font-semibold">{post.category || 'Travel Tips'}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400">{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy mb-3 leading-snug line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-1.5 text-gold font-semibold text-sm">
                  Read More <ArrowRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-14">
          <a href={tenantUrl(tenant?.subdomain, '/blog')} className="btn-outline-gold">
            View All Articles
          </a>
        </div>
      </div>
    </section>
  )
}
