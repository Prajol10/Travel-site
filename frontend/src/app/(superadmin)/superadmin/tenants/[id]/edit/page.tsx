'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import TenantForm, { initTenantForm } from '@/components/superadmin/TenantForm'

export default function EditTenantPage() {
  const params = useParams()
  const tenantId = params.id as string
  const [initial, setInitial] = useState<ReturnType<typeof initTenantForm> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/superadmin/tenants/${tenantId}`)
        setInitial(initTenantForm(res.data.data))
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load travel site')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenantId])

  if (loading) {
    return <div style={{ padding: '2rem', color: '#64748B' }}>Loading...</div>
  }

  if (error || !initial) {
    return <div style={{ padding: '2rem', color: '#DC2626' }}>{error || 'Travel site not found'}</div>
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)', marginBottom: '1.5rem' }}>
        Edit Travel Site
      </h1>
      <TenantForm initial={initial} tenantId={tenantId} />
    </div>
  )
}
