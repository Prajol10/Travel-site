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
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2.5rem',
            padding: '1.75rem 0',
          }}
        >
          {stats.map((stat, i) => {
            const Icon = ICON_MAP[stat.iconName?.toLowerCase() || ''] || Award
            return (
              <div key={stat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={26} strokeWidth={1.5} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1rem', lineHeight: 1.2, fontFamily: 'var(--font-serif)' }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{stat.label}</div>
                </div>
                {i < stats.length - 1 && (
                  <div style={{ width: '1px', height: '32px', background: '#E5E1D8', marginLeft: '1.25rem' }} className="hidden md:block" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
