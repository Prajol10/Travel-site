import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Temporary: until a real domain + wildcard subdomain routing is set up,
// the bare Vercel deployment URL should land on superadmin login instead
// of falling through to the demo tenant's public homepage.
const DEPLOYMENT_HOST = 'travel-site-three-gamma.vercel.app'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  if (host === DEPLOYMENT_HOST && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
