/** Error tracking */

interface ErrorRecord {
  message: string
  stack?: string
  url: string
  timestamp: number
  userAgent: string
}

const ERRORS_KEY = 'frontier-radar-errors'
const MAX_ERRORS = 100

export function recordError(error: Error, context?: string): void {
  try {
    const raw = localStorage.getItem(ERRORS_KEY)
    const errors: ErrorRecord[] = raw ? JSON.parse(raw) : []

    errors.push({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    })

    // Keep only recent errors
    if (errors.length > MAX_ERRORS) {
      errors.splice(0, errors.length - MAX_ERRORS)
    }

    localStorage.setItem(ERRORS_KEY, JSON.stringify(errors))

    // Also log to console
    console.error('Error recorded:', error, context)
  } catch {
    // ignore
  }
}

export function getErrors(): ErrorRecord[] {
  try {
    const raw = localStorage.getItem(ERRORS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearErrors(): void {
  try {
    localStorage.removeItem(ERRORS_KEY)
  } catch {
    // ignore
  }
}

// Global error handler
export function setupErrorTracking(): void {
  window.addEventListener('error', (event) => {
    recordError(new Error(event.message), 'global')
  })

  window.addEventListener('unhandledrejection', (event) => {
    recordError(new Error(String(event.reason)), 'unhandledrejection')
  })
}
