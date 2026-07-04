import { useState, useEffect, useMemo } from 'react'
import type { Domain, ItemType, FeedData } from '../types'
import { fetchFeed, fetchMeta, exportAsCSV, exportAsJSON } from '../lib/data'
import FilterBar from '../components/FilterBar'
import ItemCard from '../components/ItemCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import SourceHealthFooter from '../components/SourceHealthFooter'

const PAGE_SIZE = 20

export default function Home() {
  const [data, setData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [domains, setDomains] = useState<Domain[]>([])
  const [types, setTypes] = useState<ItemType[]>([])
  const [minScore, setMinScore] = useState(0)
  const [health, setHealth] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [showExport, setShowExport] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [feed, meta] = await Promise.all([fetchFeed(), fetchMeta()])
      setData(feed)
      setHealth(meta.source_health)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.items.filter(item => {
      if (domains.length > 0 && !item.domain.some(d => domains.includes(d))) return false
      if (types.length > 0 && !types.includes(item.type)) return false
      if (item.score < minScore) return false
      return true
    })
  }, [data, domains, types, minScore])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginatedItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleDomain = (d: Domain) => {
    setDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
    setPage(1)
  }
  const toggleType = (t: ItemType) => {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
    setPage(1)
  }

  const handleExportCSV = () => {
    exportAsCSV(filtered, `frontier-radar-feed-${new Date().toISOString().slice(0, 10)}.csv`)
    setShowExport(false)
  }

  const handleExportJSON = () => {
    exportAsJSON(filtered, `frontier-radar-feed-${new Date().toISOString().slice(0, 10)}.json`)
    setShowExport(false)
  }

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-1">精选 Feed</h2>
          <p className="text-sm text-gray-500">
            {data?.generated_at && `更新于 ${new Date(data.generated_at).toLocaleString('zh-CN')}`}
            {' · '}{filtered.length} 条
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            className="px-3 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            📥 导出
          </button>
          {showExport && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
              <button
                onClick={handleExportCSV}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded-t-lg"
              >
                导出为 CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded-b-lg"
              >
                导出为 JSON
              </button>
            </div>
          )}
        </div>
      </div>

      <FilterBar
        selectedDomains={domains}
        selectedTypes={types}
        onDomainToggle={toggleDomain}
        onTypeToggle={toggleType}
        minScore={minScore}
        onMinScoreChange={setMinScore}
      />

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <EmptyState message="今日暂无条目，换个筛选试试" />
        ) : (
          paginatedItems.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="text-sm text-gray-500 px-4">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      <SourceHealthFooter health={health} />
    </div>
  )
}
