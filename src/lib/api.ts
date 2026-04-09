function isLocalHostname(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

const VITE_API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || ''
// If the URL ends with /api, remove it because endpoints already start with /api
const API_URL = VITE_API_URL.replace(/\/api\/?$/, '')
const PUBLIC_CACHE_TTL_MS = 30_000
const ADMIN_CACHE_TTL_MS = 5 * 60_000
const REQUEST_TIMEOUT_MS = 25_000

function normalizeRequestError(error: unknown, endpoint: string): Error {
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'Request failed'
  const message = rawMessage.toLowerCase()
  const isAbort =
    (error instanceof Error && error.name === 'AbortError') ||
    message.includes('aborted') ||
    message.includes('signal is aborted') ||
    message.startsWith('timeout:')

  if (isAbort) {
    return new Error(
      `Request to ${endpoint} timed out after ${REQUEST_TIMEOUT_MS / 1000}s. Please try again.`,
    )
  }

  return error instanceof Error ? error : new Error(rawMessage)
}

function readCache<T>(key: string, ttlMs: number): { success: boolean; data: T } | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts: number; value: { success: boolean; data: T } }
    if (Date.now() - parsed.ts > ttlMs) {
      window.sessionStorage.removeItem(key)
      return null
    }
    return parsed.value
  } catch {
    return null
  }
}

function readCacheAnyAge<T>(key: string): { success: boolean; data: T } | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts: number; value: { success: boolean; data: T } }
    return parsed.value
  } catch {
    return null
  }
}

function writeCache<T>(key: string, value: { success: boolean; data: T }) {
  try {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), value }))
  } catch {
    // Ignore cache write errors
  }
}

function clearCacheByPrefix(prefix: string) {
  try {
    if (typeof window === 'undefined') return
    const keys = Object.keys(window.sessionStorage)
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        window.sessionStorage.removeItem(key)
      }
    })
  } catch {
    // Ignore cache clear errors
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController()
  const timer = globalThis.setTimeout(
    () => controller.abort(`timeout:${REQUEST_TIMEOUT_MS}`),
    REQUEST_TIMEOUT_MS,
  )
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (error) {
    throw normalizeRequestError(error, url)
  } finally {
    globalThis.clearTimeout(timer)
  }
}

async function fetchApi<T>(endpoint: string): Promise<{ success: boolean; data: T }> {
  const cacheKey = `api-cache:public:${endpoint}`
  try {
    const cached = readCache<T>(cacheKey, PUBLIC_CACHE_TTL_MS)
    if (cached) return cached

    const response = await fetchWithTimeout(`${API_URL}${endpoint}`)
    const contentType = response.headers.get('content-type')
    if (!response.ok) {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json().catch(() => ({} as any))
        throw new Error(errorData?.error || `Request failed (${response.status})`)
      }
      throw new Error(`Request failed (${response.status})`)
    }
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format')
    }
    const data = await response.json()
    writeCache(cacheKey, data)
    return data
  } catch (error) {
    const stale = readCacheAnyAge<T>(cacheKey)
    if (stale) return stale
    const normalized = normalizeRequestError(error, endpoint)
    console.error(`Error fetching ${endpoint}:`, normalized)
    throw normalized
  }
}

export const publicApi = {
  async getSite() {
    return fetchApi('/api/public/site')
  },
  
  async getWeeklyPrograms() {
    return fetchApi('/api/public/programs/weekly')
  },
  
  async getPrograms(day?: string) {
    const url = day ? `/api/public/programs?day=${day}` : '/api/public/programs'
    return fetchApi(url)
  },
  
  async getUpcomingEvents() {
    return fetchApi('/api/public/events/upcoming')
  },
  
  async getEvents(cursor?: string, limit?: number) {
    const params = new URLSearchParams()
    if (cursor) params.append('cursor', cursor)
    if (limit) params.append('limit', limit.toString())
    const query = params.toString()
    return fetchApi(`/api/public/events${query ? `?${query}` : ''}`)
  },
  
  async getLive() {
    return fetchApi('/api/public/live')
  },
  
  async getSermonSource() {
    return fetchApi('/api/public/sermons/source')
  },
  
  async getSermons() {
    return fetchApi('/api/public/sermons')
  },
  
  async getLeaders() {
    return fetchApi('/api/public/leaders')
  },

  async getLinks() {
    return fetchApi('/api/public/links')
  },
}

async function fetchApiWithAuth<T>(endpoint: string, token: string, options: RequestInit = {}): Promise<{ success: boolean; data: T }> {
  const method = (options.method || 'GET').toUpperCase()
  const cacheKey = `api-cache:admin:${token}:${endpoint}`
  try {
    if (method === 'GET') {
      const cached = readCache<T>(cacheKey, ADMIN_CACHE_TTL_MS)
      if (cached) return cached
    }

    const isFormData = options.body instanceof FormData
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      ...((options.headers as Record<string, string>) || {}),
    }

    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })
    const contentType = response.headers.get('content-type')
    if (!response.ok) {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json().catch(() => ({} as any))
        throw new Error(errorData?.error || `Request failed (${response.status})`)
      }
      throw new Error(`Request failed (${response.status})`)
    }
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format')
    }
    const data = await response.json()
    if (method === 'GET') {
      writeCache(cacheKey, data)
    } else {
      clearCacheByPrefix(`api-cache:admin:${token}:`)
      clearCacheByPrefix('api-cache:public:/api/public/')
    }
    return data
  } catch (error) {
    if (method === 'GET') {
      const stale = readCacheAnyAge<T>(cacheKey)
      if (stale) return stale
    }
    const normalized = normalizeRequestError(error, endpoint)
    console.error(`Error fetching ${endpoint}:`, normalized)
    throw normalized
  }
}

export const adminApi = {
  async login(username: string, password: string) {
    const response = await fetchWithTimeout(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    let data: { success?: boolean; data?: any; error?: string }
    try {
      data = await response.json()
    } catch {
      const apiHost = API_URL || 'this site (/api)'
      data = { success: false, error: response.ok ? 'Invalid response' : `Server error. Is the API running on ${apiHost}?` }
    }
    if (!response.ok && data && !data.error) {
      data.error = response.status === 500 ? 'Server error. Check API is running and database is set up.' : 'Login failed.'
    }
    return data
  },

  async getPrograms(token: string) {
    return fetchApiWithAuth('/api/admin/programs', token)
  },

  async createProgram(token: string, programData: any) {
    return fetchApiWithAuth('/api/admin/programs', token, {
      method: 'POST',
      body: JSON.stringify(programData),
    })
  },

  async updateProgram(token: string, id: string, programData: any) {
    return fetchApiWithAuth(`/api/admin/programs/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(programData),
    })
  },

  async deleteProgram(token: string, id: string) {
    return fetchApiWithAuth(`/api/admin/programs/${id}`, token, {
      method: 'DELETE',
    })
  },

  async getAdmins(token: string) {
    return fetchApiWithAuth('/api/admin/admins', token)
  },

  async createAdmin(token: string, adminData: any) {
    return fetchApiWithAuth('/api/admin/admins', token, {
      method: 'POST',
      body: JSON.stringify(adminData),
    })
  },

  async getLive(token: string) {
    return fetchApiWithAuth('/api/admin/live', token)
  },

  async updateLive(token: string, liveData: any) {
    return fetchApiWithAuth('/api/admin/live', token, {
      method: 'PUT',
      body: JSON.stringify(liveData),
    })
  },

  async getSermons(token: string) {
    return fetchApiWithAuth('/api/admin/sermons', token)
  },

  async createSermon(token: string, sermonData: any) {
    return fetchApiWithAuth('/api/admin/sermons', token, {
      method: 'POST',
      body: JSON.stringify(sermonData),
    })
  },

  async updateSermon(token: string, id: string, sermonData: any) {
    return fetchApiWithAuth(`/api/admin/sermons/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(sermonData),
    })
  },

  async deleteSermon(token: string, id: string) {
    return fetchApiWithAuth(`/api/admin/sermons/${id}`, token, {
      method: 'DELETE',
    })
  },

  async getUpdateLinks(token: string) {
    return fetchApiWithAuth('/api/admin/update-links', token)
  },

  async createUpdateLink(token: string, data: { title: string; url: string; description?: string; category?: string; is_active?: boolean; display_order?: number }) {
    return fetchApiWithAuth('/api/admin/update-links', token, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateUpdateLink(token: string, id: string, data: { title?: string; url?: string; description?: string; category?: string; is_active?: boolean; display_order?: number }) {
    return fetchApiWithAuth(`/api/admin/update-links/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteUpdateLink(token: string, id: string) {
    return fetchApiWithAuth(`/api/admin/update-links/${id}`, token, {
      method: 'DELETE',
    })
  },

  // Photo management functions
  async getPhotos(token: string) {
    return fetchApiWithAuth('/api/admin/photos', token)
  },

  async uploadPhoto(token: string, file: File) {
    const formData = new FormData()
    formData.append('photo', file)
    
    return fetchApiWithAuth('/api/admin/photos', token, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData
    })
  },

  async deletePhoto(token: string, filename: string) {
    return fetchApiWithAuth(`/api/admin/photos/${filename}`, token, {
      method: 'DELETE',
    })
  },
}
