import Cookies from 'js-cookie'
import { AuthResponse } from '@/types'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function saveAuth(auth: AuthResponse) {
  const expires = new Date(auth.expiresAt)
  Cookies.set(TOKEN_KEY, auth.token, {
    expires,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  Cookies.set(USER_KEY, JSON.stringify({
    fullName: auth.fullName,
    email: auth.email,
    role: auth.role,
    tenantId: auth.tenantId,
  }), {
    expires,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY)
}

export function getUser() {
  const user = Cookies.get(USER_KEY)
  if (!user) return null
  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export function clearAuth() {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(USER_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function isSuperAdmin(): boolean {
  const user = getUser()
  return user?.role === 'SuperAdmin'
}

export function isTenantAdmin(): boolean {
  const user = getUser()
  return user?.role === 'TenantAdmin' || user?.role === 'SuperAdmin'
}
