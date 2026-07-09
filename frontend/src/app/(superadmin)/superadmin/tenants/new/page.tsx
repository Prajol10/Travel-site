'use client'

import TenantForm, { initTenantForm } from '@/components/superadmin/TenantForm'

export default function NewTenantPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy, #1B2B4B)', marginBottom: '1.5rem' }}>
        Create New Travel Site
      </h1>
      <TenantForm initial={initTenantForm()} />
    </div>
  )
}
