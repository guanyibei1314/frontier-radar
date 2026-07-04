/** Performance monitoring */

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
}

const METRICS_KEY = 'frontier-radar-metrics'
const MAX_METRICS = 1000

export function recordMetric(name: string, value: number): void {
  try {
    const raw = localStorage.getItem(METRICS_KEY)
    const metrics: PerformanceMetric[] = raw ? JSON.parse(raw) : []

    metrics.push({
      name,
      value,
      timestamp: Date.now(),
    })

    // Keep only recent metrics
    if (metrics.length > MAX_METRICS) {
      metrics.splice(0, metrics.length - MAX_METRICS)
    }

    localStorage.setItem(METRICS_KEY, JSON.stringify(metrics))
  } catch {
    // ignore
  }
}

export function getMetrics(): PerformanceMetric[] {
  try {
    const raw = localStorage.getItem(METRICS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getAverageMetric(name: string, hours: number = 24): number {
  try {
    const metrics = getMetrics()
    const now = Date.now()
    const cutoff = now - hours * 60 * 60 * 1000

    const filtered = metrics.filter(m => m.name === name && m.timestamp >= cutoff)
    if (filtered.length === 0) return 0

    const sum = filtered.reduce((acc, m) => acc + m.value, 0)
    return sum / filtered.length
  } catch {
    return 0
  }
}

export function clearMetrics(): void {
  try {
    localStorage.removeItem(METRICS_KEY)
  } catch {
    // ignore
  }
}

// Measure page load time
export function measurePageLoad(): void {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      recordMetric('pageLoad', navigation.loadEventEnd - navigation.startTime)
      recordMetric('domContentLoaded', navigation.domContentLoadedEventEnd - navigation.startTime)
      recordMetric('firstPaint', navigation.responseEnd - navigation.startTime)
    }
  }
}

// Measure API response time
export function measureApiCall(url: string, startTime: number): void {
  const duration = Date.now() - startTime
  recordMetric(`api:${url}`, duration)
}
