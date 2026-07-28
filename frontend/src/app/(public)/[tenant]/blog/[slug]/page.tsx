'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTenant } from '@/context/TenantContext'
import { tenantUrl, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import FaqSection from '@/components/sections/FaqSection'
import SpeakToExpert from '@/components/sections/SpeakToExpert'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface BlogPostDetail {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: string
  coverImageUrl?: string
  category?: string
  publishedAt?: string
  createdAt: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const tenantSlug = params.tenant as string
  const { tenant, data } = useTenant()
  const [post, setPost] = useState<BlogPostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!tenant?.id) return
    setLoading(true)
    setNotFound(false)
    api.get(`/api/blog/${tenant.id}/slug/${slug}`)
      .then((res) => setPost(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [tenant?.id, slug])

  const related = (data?.blogs || []).filter((p) => p.slug !== slug).slice(0, 3)

  if (loading) {
    return <div style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--gray-500)' }}>Loading...</div>
  }

  if (notFound || !post) {
    return (
      <div style={{ padding: '10rem 0', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--gray-500)', marginBottom: '1.5rem' }}>This post could not be found.</p>
        <a href={tenantUrl(tenantSlug, '/blog')} className="btn-gold">Back to Blog</a>
      </div>
    )
  }

  return (
    <>
      <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,43,75,0.92), rgba(27,43,75,0.35))' }} />
        <div className="container" style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{post.category || 'Travel Tips'}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, maxWidth: '780px' }}>
            {post.title}
          </h1>
        </div>
      </div>

      <section style={{ padding: '4rem 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <a href={tenantUrl(tenantSlug, '/blog')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '2.5rem' }}>
            <ArrowLeft size={15} /> Back to Blog
          </a>

          {post.excerpt && (
            <p style={{ fontSize: '1.15rem', color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 500 }}>
              {post.excerpt}
            </p>
          )}

          <div
            className="tour-full-description"
            style={{ color: 'var(--gray-600)', lineHeight: 1.85, fontSize: '1.02rem' }}
            dangerouslySetInnerHTML={{ __html: post.body || '<p>Content coming soon.</p>' }}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ padding: '3rem 0 5rem', background: '#FAF9F6', borderTop: '1px solid #E5E1D8' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>
              More From the Blog
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {related.map((p) => (
                <a key={p.id} href={tenantUrl(tenantSlug, `/blog/${p.slug}`)} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ height: '160px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    {p.coverImageUrl ? (
                      <img src={p.coverImageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
                    )}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem', marginBottom: '0.4rem', lineHeight: 1.3 }}>{p.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--gold)', fontWeight: 600, fontSize: '0.8rem' }}>
                    Read More <ArrowRight size={13} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <SpeakToExpert />
      <FaqSection />
    </>
  )
}
