/** Data access layer — sole data entry point for frontend. */
import type { FeedData, MetaData } from '../types'

const BASE = '/data'

export async function fetchFeed(): Promise<FeedData> {
  const res = await fetch(`${BASE}/feed.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch feed: ${res.status}`)
  return res.json()
}

export async function fetchAll(): Promise<FeedData> {
  const res = await fetch(`${BASE}/all.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch all: ${res.status}`)
  return res.json()
}

export async function fetchMeta(): Promise<MetaData> {
  const res = await fetch(`${BASE}/meta.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch meta: ${res.status}`)
  return res.json()
}

/** Relative time string from UTC ISO8601. */
export function relativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then

  if (diff < 0) return '刚刚'
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  return `${months} 月前`
}
