'use client'

import TourForm, { initTourForm } from '@/components/admin/TourForm'

export default function NewTourPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)', marginBottom: '1.5rem' }}>
        New Tour
      </h1>
      <TourForm initial={initTourForm()} />
    </div>
  )
}
