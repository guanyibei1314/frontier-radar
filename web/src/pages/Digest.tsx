import { useState, useEffect, useMemo } from 'react'
import type { FeedData } from '../types'
import { fetchFeed } from '../lib/data'
import ItemCard from '../components/ItemCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Digest() {
  const [data, setData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('today')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const feed = await fetchFeed()
      setData(feed)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const digestItems = useMemo(() => {
    if (!data) return []

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    return data.items.filter(item => {
      const pubDate = new Date(item.published_at)

      switch (selectedDate) {
        case 'today':
          return pubDate >= today
        case 'yesterday':
          return pubDate >= yesterday && pubDate < today
        case 'week':
          return pubDate >= weekAgo
        default:
          return true
      }
    }).sort((a, b) => b.score - a.score)
  }, [data, selectedDate])

  // Group by domain
  const groupedByDomain = useMemo(() => {
    const groups: Record<string, typeof digestItems> = {
      ai: [],
      embodied: [],
      drone: [],
    }

    digestItems.forEach(item => {
      item.domain.forEach(d => {
        if (groups[d]) {
          groups[d].push(item)
        }
      })
    })

    return groups
  }, [digestItems])

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 mb-1">每日精选</h2>
        <p className="text-sm text-gray-500">
          {digestItems.length} 条精选内容
        </p>
      </div>

      {/* Date Selector */}
      <div className="mb-6 flex gap-2">
        {[
          { key: 'today', label: '今天' },
          { key: 'yesterday', label: '昨天' },
          { key: 'week', label: '本周' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedDate(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDate === key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { domain: 'ai', label: 'AI', color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
          { domain: 'embodied', label: '具身智能', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
          { domain: 'drone', label: '无人机', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
        ].map(({ domain, label, color, bgColor, borderColor }) => (
          <div key={domain} className={`${bgColor} border ${borderColor} rounded-xl p-4 text-center`}>
            <div className={`text-3xl font-bold ${color}`}>
              {groupedByDomain[domain]?.length || 0}
            </div>
            <div className="text-sm text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Top Items by Domain */}
      {Object.entries(groupedByDomain).map(([domain, items]) => {
        if (items.length === 0) return null

        const domainLabels: Record<string, string> = {
          ai: 'AI',
          embodied: '具身智能',
          drone: '无人机',
        }

        const domainColors: Record<string, string> = {
          ai: 'text-purple-400',
          embodied: 'text-emerald-400',
          drone: 'text-amber-400',
        }

        return (
          <div key={domain} className="mb-8">
            <h3 className={`text-lg font-semibold ${domainColors[domain]} mb-4`}>
              {domainLabels[domain]} Top {Math.min(items.length, 5)}
            </h3>
            <div className="space-y-4">
              {items.slice(0, 5).map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )
      })}

      {digestItems.length === 0 && (
        <EmptyState message="暂无精选内容" />
      )}
    </div>
  )
}
