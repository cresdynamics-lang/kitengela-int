const TOKEN_KEY = 'adminToken'
const ADMIN_KEY = 'admin'
const ACTIVE_TAB_KEY = 'adminActiveTab'

export type AdminSessionUser = {
  id: string
  username: string
  email?: string
  role?: string
  isSuperAdmin?: boolean
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAdminUser(): AdminSessionUser | null {
  const raw = localStorage.getItem(ADMIN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminSessionUser
  } catch {
    return null
  }
}

export function setAdminSession(token: string, admin: AdminSessionUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_KEY)
  localStorage.removeItem(ACTIVE_TAB_KEY)
}

export function getAdminActiveTab<T extends string>(fallback: T) {
  const saved = localStorage.getItem(ACTIVE_TAB_KEY)
  return (saved as T | null) || fallback
}

export function setAdminActiveTab(tab: string) {
  localStorage.setItem(ACTIVE_TAB_KEY, tab)
}
