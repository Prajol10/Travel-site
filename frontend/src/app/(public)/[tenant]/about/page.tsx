'use client'

import { useTenant } from '@/context/TenantContext'
import { getContentSection, tenantUrl } from '@/lib/utils'
import { Award, Leaf, Users, Shield } from 'lucide-react'

export default function AboutPage() {
  const { data, tenant } = useTenant()
  const section = getContentSection(data?.content || [], 'AboutUs')
  const team = data?.team || []
  const whyChooseUs = data?.whyChooseUs || []

  return (
    <>
      {/* Hero */}
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>About Us</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            {section?.title || 'Journey with Passion & Experience'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {section?.subtitle || 'Trusted Himalayan travel experts since 2008'}
          </p>
        </div>
      </div>

      {/* Story */}
      <section style={{ padding: '96px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ borderRadius: '1rem', overflow: 'hidden', aspectRatio: '4/3' }}>
              {section?.imageUrl ? (
                <img
                  src={section.imageUrl}
                  alt="About us"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--navy), #2c3e5c)' }} />
              )}
            </div>
            <div>
              <div className="section-label-left" style={{ marginBottom: '1.25rem' }}>Our Story</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.5rem' }}>
                {section?.title || 'Journey with Passion & Experience'}
              </h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                {section?.body || 'We have been guiding travelers to sacred and breathtaking destinations for years, committed to providing safe, enriching, and memorable travel experiences.'}
              </p>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Award size={28} color="var(--gold)" strokeWidth={1.5} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.875rem' }}>Award Winning</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>Best Adventure Operator</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Leaf size={28} color="var(--gold)" strokeWidth={1.5} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.875rem' }}>Eco-Friendly</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>Sustainable tourism</div>
                  </div>
                </div>
              </div>
              <a href={tenantUrl(tenant?.subdomain, '/contact')} className="btn-gold">{section?.ctaText || 'Get In Touch'}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      {whyChooseUs.length > 0 && (
        <section style={{ padding: '96px 0', background: 'var(--navy)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Why Choose Us</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#ffffff' }}>
                What Sets Us Apart
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {whyChooseUs.map((item) => (
                <div key={item.id} style={{ textAlign: 'center' }}>
                  <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Shield size={24} color="var(--gold)" />
                  </div>
                  <h3 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section id="team" style={{ padding: '96px 0', background: '#ffffff' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Our Team</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--navy)' }}>Meet Our Experts</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {team.map((member) => (
                <div key={member.id} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', background: 'var(--gold-pale)' }}>
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem', color: 'var(--gold)' }}>
                        {member.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem' }}>{member.fullName}</h3>
                  <p style={{ color: 'var(--gold)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{member.role}</p>
                  {member.region && <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{member.region}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
