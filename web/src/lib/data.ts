/** Data access layer — sole data entry point for frontend. */
import type { FeedData, MetaData } from '../types'
import { getCached, setCache } from './cache'

const BASE = '/data'

export async function fetchFeed(): Promise<FeedData> {
  const cached = getCached<FeedData>('feed')
  if (cached) return cached

  const res = await fetch(`${BASE}/feed.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch feed: ${res.status}`)
  const data = await res.json()
  setCache('feed', data)
  return data
}

export async function fetchAll(): Promise<FeedData> {
  const cached = getCached<FeedData>('all')
  if (cached) return cached

  const res = await fetch(`${BASE}/all.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch all: ${res.status}`)
  const data = await res.json()
  setCache('all', data)
  return data
}

export async function fetchMeta(): Promise<MetaData> {
  const cached = getCached<MetaData>('meta')
  if (cached) return cached

  const res = await fetch(`${BASE}/meta.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch meta: ${res.status}`)
  const data = await res.json()
  setCache('meta', data)
  return data
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

/** Export data as CSV */
export function exportAsCSV(items: any[], filename: string): void {
  const headers = ['title_zh', 'title_raw', 'url', 'source', 'score', 'domain', 'type', 'reason']
  const csvContent = [
    headers.join(','),
    ...items.map(item =>
      headers.map(h => {
        const value = item[h]
        if (Array.isArray(value)) return `"${value.join('; ')}"`
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/** Export data as JSON */
export function exportAsJSON(items: any[], filename: string): void {
  const jsonContent = JSON.stringify(items, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
