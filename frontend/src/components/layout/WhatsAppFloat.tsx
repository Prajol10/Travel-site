'use client'

import { MessageCircle } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

export default function WhatsAppFloat() {
  const { tenant } = useTenant()
  const number = tenant?.whatsAppNumber?.replace(/[^0-9]/g, '') || ''

  if (!number) return null

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} color="white" fill="white" strokeWidth={0} />
    </a>
  )
}
