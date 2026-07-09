'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Currency } from '@/types'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  currencies: { value: Currency; label: string; symbol: string }[]
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  currencies: [],
})

export const currencies = [
  { value: 'USD' as Currency, label: 'USD ($)', symbol: '$' },
  { value: 'INR' as Currency, label: 'INR (₹)', symbol: '₹' },
  { value: 'EUR' as Currency, label: 'EUR (€)', symbol: '€' },
]

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD')

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
