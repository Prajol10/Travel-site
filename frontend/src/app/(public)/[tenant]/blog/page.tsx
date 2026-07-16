'use client'

import { useTenant } from '@/context/TenantContext'
import { useParams } from 'next/navigation'
import { formatDate, tenantUrl } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export default function BlogPage() {
  const { data } = useTenant()
  const params = useParams()
  const posts = data?.blogs || []

  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Travel Insights</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Our Blog
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
            Expert tips, guides, and stories from the Himalayas
          </p>
        </div>
      </div>

      <section style={{ padding: '96px 0', background: '#FAF9F6' }}>
        <div className="container">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-500)' }}>
              <p style={{ fontSize: '1.1rem' }}>No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
              {posts.map((post) => (
                <a key={post.id} href={tenantUrl(params.tenant as string, `/blog/${post.slug}`)} className="card" style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ height: '220px', overflow: 'hidden' }}>
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{post.category || 'Travel Tips'}</span>
                      <span style={{ color: 'var(--gray-300)' }}>•</span>
                      <span style={{ color: 'var(--gray-400)' }}>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                    {post.excerpt && <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{post.excerpt}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--gold)', fontWeight: 600, fontSize: '0.875rem' }}>
                      Read More <ArrowRight size={14} />
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
