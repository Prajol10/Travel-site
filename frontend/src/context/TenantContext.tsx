'use client'

import { createContext, useContext, ReactNode } from 'react'
import { HomepageData, Tenant } from '@/types'

interface TenantContextType {
  data: HomepageData | null
  tenant: Tenant | null
}

const TenantContext = createContext<TenantContextType>({
  data: null,
  tenant: null,
})

export function TenantProvider({
  children,
  data,
}: {
  children: ReactNode
  data: HomepageData | null
}) {
  return (
    <TenantContext.Provider value={{ data, tenant: data?.tenant ?? null }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  return useContext(TenantContext)
}
