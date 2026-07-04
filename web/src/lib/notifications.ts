/** Notification management */

const NOTIFICATION_KEY = 'frontier-radar-notifications'

interface NotificationConfig {
  enabled: boolean
  highScoreThreshold: number
  newItemsInterval: number // minutes
  sound: boolean
}

const defaultConfig: NotificationConfig = {
  enabled: true,
  highScoreThreshold: 80,
  newItemsInterval: 60,
  sound: false,
}

export function getNotificationConfig(): NotificationConfig {
  try {
    const raw = localStorage.getItem(NOTIFICATION_KEY)
    if (raw) {
      return { ...defaultConfig, ...JSON.parse(raw) }
    }
  } catch {
    // ignore
  }
  return defaultConfig
}

export function saveNotificationConfig(config: Partial<NotificationConfig>): void {
  try {
    const current = getNotificationConfig()
    const updated = { ...current, ...config }
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

export function resetNotificationConfig(): void {
  try {
    localStorage.removeItem(NOTIFICATION_KEY)
  } catch {
    // ignore
  }
}

// Request browser notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// Send browser notification
export function sendNotification(title: string, body: string, url?: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  const notification = new Notification(title, {
    body,
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: 'frontier-radar',
  })

  notification.onclick = () => {
    window.focus()
    if (url) {
      window.location.href = url
    }
    notification.close()
  }
}
