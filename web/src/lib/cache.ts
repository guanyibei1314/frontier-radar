/** Local storage cache for faster data loading */

const CACHE_KEY = 'frontier-radar-cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}-${key}`)
    if (!raw) return null

    const entry: CacheEntry<T> = JSON.parse(raw)
    const now = Date.now()

    if (now - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(`${CACHE_KEY}-${key}`)
      return null
    }

    return entry.data
  } catch {
    return null
  }
}

export function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(`${CACHE_KEY}-${key}`, JSON.stringify(entry))
  } catch {
    // localStorage might be full or disabled
  }
}

export function clearCache(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY)) {
        localStorage.removeItem(key)
      }
    })
  } catch {
    // ignore
  }
}
