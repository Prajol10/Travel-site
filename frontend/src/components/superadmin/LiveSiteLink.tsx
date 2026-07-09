'use client'

import React from 'react'

interface LiveSiteLinkProps {
  subdomain: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const linkStyle = {
  marginRight: '0.5rem',
  padding: '0.35rem 0.7rem',
  fontSize: '0.8rem',
  border: '1px solid #CBD5E1',
  borderRadius: '6px',
  background: '#fff',
  textDecoration: 'none',
  color: '#334155',
  display: 'inline-block',
}

export default function LiveSiteLink({ subdomain }: LiveSiteLinkProps) {
  const cleanUrl = SITE_URL.replace(/^https?:\/\//, '')
  const protocol = SITE_URL.startsWith('https') ? 'https' : 'http'
  const href = protocol + '://' + subdomain + '.' + cleanUrl

  return React.createElement(
    'a',
    { href: href, target: '_blank', rel: 'noopener noreferrer', style: linkStyle },
    'Live Site'
  )
}
