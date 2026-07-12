'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { saveAuth } from '@/lib/auth'
import { AuthResponse } from '@/types'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const auth: AuthResponse = res.data.data
      saveAuth(auth)
      if (auth.role === 'SuperAdmin') {
        router.push('/superadmin/dashboard')
      } else {
        const tenantRes = await api.get('/api/tenant/me')
        const subdomain = tenantRes.data.data.subdomain
        router.push(`/${subdomain}/admin/dashboard`)
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>
      <div style={{ padding: '1.25rem 0', borderBottom: '1px solid #EAE7DE', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--gold, #C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>T</div>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--navy, #1B2B4B)', fontSize: '1.15rem' }}>Travel Platform</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2.2rem', color: 'var(--navy, #1B2B4B)', marginBottom: '0.5rem' }}>
          Welcome Back
        </h1>
        <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '2rem' }}>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: '14px', padding: '2rem', boxShadow: '0 4px 20px rgba(27,43,75,0.08)' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 700, color: 'var(--navy, #1B2B4B)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem 0.9rem', border: '1px solid #D9D5C9', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontWeight: 700, color: 'var(--navy, #1B2B4B)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem 0.9rem', border: '1px solid #D9D5C9', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <span style={{ fontSize: '0.875rem', color: 'var(--gold, #C9A84C)', fontWeight: 600, cursor: 'pointer' }}>Forgot Password?</span>
          </div>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.6rem 0.75rem', background: '#FEF2F2', color: '#B91C1C', fontSize: '0.85rem', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, #C9A84C, #B8863A)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
