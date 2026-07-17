'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #E5E1D8' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '1rem', paddingRight: '1rem' }}>{question}</span>
        <ChevronDown
          size={20}
          color="var(--gray-400, #94A3B8)"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        />
      </button>
      {open && (
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.7, paddingBottom: '1.25rem', margin: 0 }}>
          {answer}
        </p>
      )}
    </div>
  )
}

export default function FaqSection() {
  const { data } = useTenant()
  const faqs = data?.faqs || []
  if (faqs.length === 0) return null

  return (
    <section className="section bg-white">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--navy)',
          }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div style={{ maxWidth: '760px', margin: '0 auto', border: '1px solid #E5E1D8', borderRadius: '12px', padding: '0 1.75rem' }}>
          {faqs.map((faq) => (
            <FaqAccordionItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
