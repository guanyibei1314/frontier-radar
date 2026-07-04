/** User preferences storage */

const PREFS_KEY = 'frontier-radar-preferences'

interface UserPreferences {
  theme: 'dark' | 'light'
  defaultDomains: string[]
  defaultTypes: string[]
  defaultMinScore: number
  itemsPerPage: number
  showReadItems: boolean
  autoMarkAsRead: boolean
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  defaultDomains: [],
  defaultTypes: [],
  defaultMinScore: 0,
  itemsPerPage: 20,
  showReadItems: true,
  autoMarkAsRead: true,
}

export function getPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (raw) {
      return { ...defaultPreferences, ...JSON.parse(raw) }
    }
  } catch {
    // ignore
  }
  return defaultPreferences
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  try {
    const current = getPreferences()
    const updated = { ...current, ...prefs }
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

export function resetPreferences(): void {
  try {
    localStorage.removeItem(PREFS_KEY)
  } catch {
    // ignore
  }
}
