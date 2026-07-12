'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import TourForm, { initTourForm } from '@/components/admin/TourForm'

export default function EditTourPage() {
  const params = useParams()
  const tourId = params.id as string
  const [initial, setInitial] = useState<ReturnType<typeof initTourForm> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/tours/id/${tourId}`)
        setInitial(initTourForm(res.data.data ?? res.data))
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load tour')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tourId])

  if (loading) {
    return <div style={{ padding: '2rem', color: '#64748B' }}>Loading tour...</div>
  }

  if (error || !initial) {
    return <div style={{ padding: '2rem', color: '#DC2626' }}>{error || 'Tour not found'}</div>
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)', marginBottom: '1.5rem' }}>
        Edit Tour
      </h1>
      <TourForm initial={initial} tourId={tourId} />
    </div>
  )
}
