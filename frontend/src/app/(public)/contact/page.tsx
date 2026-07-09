'use client'

import { useState } from 'react'
import { useTenant } from '@/context/TenantContext'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import api from '@/lib/api'

export default function ContactPage() {
  const { tenant, data } = useTenant()
  const team = data?.team || []
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.fullName || !form.email) return
    setLoading(true)
    try {
      await api.post(`/api/leads/${tenant?.id}`, { ...form, source: 'contact_form' })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{ background: 'var(--navy)', padding: '120px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Get In Touch</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Let's Plan Your Journey
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
            Connect with our expert team and let us create your perfect adventure
          </p>
        </div>
      </div>

      <section style={{ padding: '96px 0', background: '#FAF9F6' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            {/* Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.5rem' }}>
                Send Us Your Query
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                Our Promise: We'll respond within 24 hours with a detailed plan.
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ color: 'var(--navy)', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Thank You!</h3>
                  <p style={{ color: 'var(--gray-500)' }}>We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input className="input" placeholder="Your Full Name *" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                  <input className="input" placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                  <input className="input" type="email" placeholder="Your Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <textarea className="input" placeholder="Tell us about your travel plans..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical' }} />
                  <button onClick={handleSubmit} disabled={loading} className="btn-gold" style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                    <Send size={16} /> {loading ? 'Sending...' : 'Submit Query'}
                  </button>
                  <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.75rem' }}>We respect your privacy. Your information is safe with us.</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '2rem' }}>
                Connect With Us
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {tenant?.phoneNumber && (
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={18} color="var(--gold)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.875rem' }}>Call Us Anytime</div>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{tenant.phoneNumber}</div>
                    </div>
                  </div>
                )}
                {tenant?.email && (
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={18} color="var(--gold)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.875rem' }}>Email Us</div>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{tenant.email}</div>
                    </div>
                  </div>
                )}
                {tenant?.address && (
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={18} color="var(--gold)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.875rem' }}>Visit Our Office</div>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{tenant.address}</div>
                    </div>
                  </div>
                )}
              </div>

              {team.length > 0 && (
                <>
                  <h3 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>Our Representatives</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {team.map((member) => (
                      <div key={member.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'var(--gold-pale)' }}>
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--gold)' }}>
                              {member.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.875rem' }}>{member.fullName}</div>
                          <div style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>{member.region || member.role}</div>
                          {member.phoneNumber && <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{member.phoneNumber}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
