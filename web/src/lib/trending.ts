/** Trending items tracking */

const VIEW_KEY = 'frontier-radar-views'
const MAX_VIEWS = 10000

interface ViewRecord {
  id: string
  timestamp: number
  count: number
}

export function recordView(itemId: string): void {
  try {
    const raw = localStorage.getItem(VIEW_KEY)
    const views: ViewRecord[] = raw ? JSON.parse(raw) : []

    const existing = views.find(v => v.id === itemId)
    if (existing) {
      existing.count++
      existing.timestamp = Date.now()
    } else {
      views.push({
        id: itemId,
        timestamp: Date.now(),
        count: 1,
      })
    }

    // Keep only recent views
    const now = Date.now()
    const filtered = views.filter(v => now - v.timestamp < 7 * 24 * 60 * 60 * 1000)

    if (filtered.length > MAX_VIEWS) {
      filtered.splice(0, filtered.length - MAX_VIEWS)
    }

    localStorage.setItem(VIEW_KEY, JSON.stringify(filtered))
  } catch {
    // ignore
  }
}

export function getTrendingItems(): string[] {
  try {
    const raw = localStorage.getItem(VIEW_KEY)
    if (!raw) return []

    const views: ViewRecord[] = JSON.parse(raw)
    const now = Date.now()

    // Calculate trending score: recent views weighted more
    const scored = views.map(v => {
      const ageHours = (now - v.timestamp) / (1000 * 60 * 60)
      const recencyWeight = Math.exp(-ageHours / 24) // Decay over 24 hours
      return {
        id: v.id,
        score: v.count * recencyWeight,
      }
    })

    // Sort by score and return top items
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, 20).map(s => s.id)
  } catch {
    return []
  }
}

export function getViewCount(itemId: string): number {
  try {
    const raw = localStorage.getItem(VIEW_KEY)
    if (!raw) return 0

    const views: ViewRecord[] = JSON.parse(raw)
    const view = views.find(v => v.id === itemId)
    return view?.count || 0
  } catch {
    return 0
  }
}

export function clearViewHistory(): void {
  try {
    localStorage.removeItem(VIEW_KEY)
  } catch {
    // ignore
  }
}
