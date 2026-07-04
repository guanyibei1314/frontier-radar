/** Reading progress tracking */

const READ_KEY = 'frontier-radar-read'
const MAX_READ_ITEMS = 1000

export function markAsRead(itemId: string): void {
  try {
    const readItems = getReadItems()
    if (!readItems.includes(itemId)) {
      readItems.push(itemId)
      // Keep only last N items
      if (readItems.length > MAX_READ_ITEMS) {
        readItems.splice(0, readItems.length - MAX_READ_ITEMS)
      }
      localStorage.setItem(READ_KEY, JSON.stringify(readItems))
    }
  } catch {
    // ignore
  }
}

export function getReadItems(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function isRead(itemId: string): boolean {
  return getReadItems().includes(itemId)
}

export function markAllAsRead(itemIds: string[]): void {
  try {
    const readItems = getReadItems()
    const newItems = itemIds.filter(id => !readItems.includes(id))
    const allItems = [...readItems, ...newItems]
    // Keep only last N items
    if (allItems.length > MAX_READ_ITEMS) {
      allItems.splice(0, allItems.length - MAX_READ_ITEMS)
    }
    localStorage.setItem(READ_KEY, JSON.stringify(allItems))
  } catch {
    // ignore
  }
}

export function clearReadHistory(): void {
  try {
    localStorage.removeItem(READ_KEY)
  } catch {
    // ignore
  }
}
