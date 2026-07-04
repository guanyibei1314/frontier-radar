import { useState, useEffect, useMemo } from 'react'
import type { FeedData } from '../types'
import { fetchFeed } from '../lib/data'
import { getTrendingItems, recordView, clearViewHistory } from '../lib/trending'
import ItemCard from '../components/ItemCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Trending() {
  const [data, setData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trendingIds, setTrendingIds] = useState<string[]>([])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const feed = await fetchFeed()
      setData(feed)
      setTrendingIds(getTrendingItems())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const trendingItems = useMemo(() => {
    if (!data) return []
    return trendingIds
      .map(id => data.items.find(item => item.id === id))
      .filter(Boolean)
  }, [data, trendingIds])

  const handleClearHistory = () => {
    clearViewHistory()
    setTrendingIds([])
  }

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-1">热门趋势</h2>
          <p className="text-sm text-gray-500">
            基于浏览记录的热门内容
          </p>
        </div>
        {trendingItems.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-3 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            清除记录
          </button>
        )}
      </div>

      {/* Trending Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: '热门条目', value: trendingItems.length, color: 'text-blue-400' },
          { label: '今日新增', value: trendingItems.filter(i => {
            const pub = new Date(i!.published_at)
            const now = new Date()
            return now.getTime() - pub.getTime() < 24 * 60 * 60 * 1000
          }).length, color: 'text-emerald-400' },
          { label: '高分条目', value: trendingItems.filter(i => i!.score >= 80).length, color: 'text-yellow-400' },
          { label: '本周内容', value: trendingItems.filter(i => {
            const pub = new Date(i!.published_at)
            const now = new Date()
            return now.getTime() - pub.getTime() < 7 * 24 * 60 * 60 * 1000
          }).length, color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Trending Items */}
      <div className="space-y-4">
        {trendingItems.length === 0 ? (
          <EmptyState message="暂无热门内容，浏览条目后自动生成" />
        ) : (
          trendingItems.map((item, index) => (
            <div key={item!.id} className="relative">
              <div className="absolute -left-8 top-4 text-2xl font-bold text-gray-700">
                {index + 1}
              </div>
              <ItemCard item={item!} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
