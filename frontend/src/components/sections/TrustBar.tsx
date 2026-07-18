'use client'
import { Users, Star, DollarSign, Leaf, Award, Clock, ShieldCheck, ThumbsUp } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

const ICON_MAP: Record<string, any> = {
  users: Users,
  star: Star,
  'dollar-sign': DollarSign,
  leaf: Leaf,
  award: Award,
  clock: Clock,
  'shield-check': ShieldCheck,
  'thumbs-up': ThumbsUp,
}

export default function TrustBar() {
  const { data } = useTenant()
  const stats = data?.stats || []
  if (stats.length === 0) return null

  return (
    <div style={{ background: '#ffffff', borderBottom: '1px solid #EEEAE0' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            padding: '2.5rem 0',
          }}
        >
          {stats.map((stat, i) => {
            const Icon = ICON_MAP[stat.iconName?.toLowerCase() || ''] || Award
            return (
              <div
                key={stat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  padding: '0 1.5rem',
                  borderLeft: i > 0 ? '1px solid #E5E1D8' : 'none',
                }}
              >
                <Icon size={34} strokeWidth={1.5} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1.5rem', lineHeight: 1.2, fontFamily: 'var(--font-serif)' }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
