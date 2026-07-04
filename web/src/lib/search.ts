/** Search history management */

const SEARCH_KEY = 'frontier-radar-search-history'
const MAX_HISTORY = 20

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(SEARCH_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addToSearchHistory(query: string): void {
  try {
    const history = getSearchHistory()
    const filtered = history.filter(q => q !== query)
    filtered.unshift(query)
    if (filtered.length > MAX_HISTORY) {
      filtered.splice(MAX_HISTORY)
    }
    localStorage.setItem(SEARCH_KEY, JSON.stringify(filtered))
  } catch {
    // ignore
  }
}

export function removeFromSearchHistory(query: string): void {
  try {
    const history = getSearchHistory()
    const filtered = history.filter(q => q !== query)
    localStorage.setItem(SEARCH_KEY, JSON.stringify(filtered))
  } catch {
    // ignore
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_KEY)
  } catch {
    // ignore
  }
}
