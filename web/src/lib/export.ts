/** Export/Import functionality */

import { getPreferences, savePreferences } from './preferences'
import { getReadItems } from './reading'
import { getSearchHistory } from './search'

interface ExportData {
  version: string
  timestamp: number
  preferences: ReturnType<typeof getPreferences>
  readItems: string[]
  bookmarks: string[]
  searchHistory: string[]
}

export function exportAllData(): ExportData {
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    preferences: getPreferences(),
    readItems: getReadItems(),
    bookmarks: getBookmarks(),
    searchHistory: getSearchHistory(),
  }
}

export function downloadExport(): void {
  const data = exportAllData()
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `frontier-radar-export-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export async function importData(file: File): Promise<boolean> {
  try {
    const text = await file.text()
    const data: ExportData = JSON.parse(text)

    if (!data.version || !data.timestamp) {
      throw new Error('Invalid export file')
    }

    // Import preferences
    if (data.preferences) {
      savePreferences(data.preferences)
    }

    // Import read items
    if (data.readItems && Array.isArray(data.readItems)) {
      localStorage.setItem('frontier-radar-read', JSON.stringify(data.readItems))
    }

    // Import bookmarks
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      localStorage.setItem('bookmarks', JSON.stringify(data.bookmarks))
    }

    // Import search history
    if (data.searchHistory && Array.isArray(data.searchHistory)) {
      localStorage.setItem('frontier-radar-search-history', JSON.stringify(data.searchHistory))
    }

    return true
  } catch (error) {
    console.error('Import failed:', error)
    return false
  }
}

function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem('bookmarks')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
