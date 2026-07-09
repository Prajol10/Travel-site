'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getUser, clearAuth, isAuthenticated } from '@/lib/auth'

interface NavGroup {
  label: string
  items: { label: string; href: string }[]
}

export default function DashboardShell({
  children,
  navGroups,
  requiredRole,
  title,
}: {
  children: ReactNode
  navGroups: NavGroup[]
  requiredRole: 'TenantAdmin' | 'SuperAdmin'
  title: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
      return
    }
    const user = getUser()
    if (requiredRole === 'SuperAdmin' && user?.role !== 'SuperAdmin') {
      router.replace('/login')
      return
    }
    if (requiredRole === 'TenantAdmin' && !(user?.role === 'TenantAdmin' || user?.role === 'SuperAdmin')) {
      router.replace('/login')
      return
    }
    setChecked(true)
  }, [router, requiredRole])

  function handleLogout() {
    clearAuth()
    router.push('/login')
  }

  if (!checked) return null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F7F6F2' }}>
      <aside style={{ width: '250px', background: 'var(--navy, #1B2B4B)', color: '#ffffff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1.4rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold, #C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>T</div>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem' }}>{title}</span>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.9rem', overflowY: 'auto' }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: '1.4rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.6rem', marginBottom: '0.5rem' }}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'block',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      marginBottom: '0.2rem',
                      color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                      background: active ? 'var(--gold, #C9A84C)' : 'transparent',
                      fontSize: '0.85rem',
                      fontWeight: active ? 600 : 500,
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{ margin: '0.9rem', padding: '0.65rem', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          Log out
        </button>
      </aside>
      <main style={{ flex: 1, padding: '2.25rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
