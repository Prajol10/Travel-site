'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCurrency, currencies } from '@/context/CurrencyContext'

export default function CurrencySwitcher({ dark = false }: { dark?: boolean }) {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = currencies.find((c) => c.value === currency)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
          dark
            ? 'bg-gray-100 text-navy hover:bg-gray-200'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {current?.label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-navy-dark rounded-lg shadow-xl py-1.5 z-50 border border-white/10">
          {currencies.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setCurrency(c.value)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                c.value === currency
                  ? 'text-gold font-semibold'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              {c.label}
              {c.value === currency && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
