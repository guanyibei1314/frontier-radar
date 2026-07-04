import { useState, useEffect, useMemo, useRef } from 'react'
import type { Domain, ItemType, FeedData } from '../types'
import { fetchAll } from '../lib/data'
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } from '../lib/search'
import FilterBar from '../components/FilterBar'
import ItemCard from '../components/ItemCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'

const PAGE_SIZE = 20

export default function All() {
  const [data, setData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [domains, setDomains] = useState<Domain[]>([])
  const [types, setTypes] = useState<ItemType[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const feed = await fetchAll()
      setData(feed)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    setSearchHistory(getSearchHistory())
  }, [])

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.items.filter(item => {
      if (domains.length > 0 && !item.domain.some(d => domains.includes(d))) return false
      if (types.length > 0 && !types.includes(item.type)) return false
      if (search) {
        const q = search.toLowerCase()
        const text = `${item.title_zh} ${item.title_raw} ${item.summary_zh}`.toLowerCase()
        if (!text.includes(q)) return false
      }
      return true
    })
  }, [data, domains, types, search])

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

  const handleSearch = (query: string) => {
    setSearch(query)
    setPage(1)
    if (query.trim()) {
      addToSearchHistory(query.trim())
      setSearchHistory(getSearchHistory())
    }
  }

  const handleHistoryClick = (query: string) => {
    setSearch(query)
    setPage(1)
    setShowHistory(false)
  }

  const handleClearHistory = () => {
    clearSearchHistory()
    setSearchHistory([])
  }

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 mb-1">全部动态</h2>
        <p className="text-sm text-gray-500">
          {data?.generated_at && `更新于 ${new Date(data.generated_at).toLocaleString('zh-CN')}`}
          {' · '}{filtered.length} 条
        </p>
      </div>

      <div className="mb-4 relative" ref={searchRef}>
        <input
          type="text"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder="搜索标题或摘要..."
          className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30"
        />
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <span className="text-xs text-gray-500">搜索历史</span>
              <button
                onClick={handleClearHistory}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                清除
              </button>
            </div>
            {searchHistory.map((query, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleHistoryClick(query)}
              >
                <span className="text-sm text-gray-300">{query}</span>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    removeFromSearchHistory(query)
                    setSearchHistory(getSearchHistory())
                  }}
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <FilterBar
        selectedDomains={domains}
        selectedTypes={types}
        onDomainToggle={toggleDomain}
        onTypeToggle={toggleType}
      />

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <EmptyState message="没有匹配的条目" />
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
    </div>
  )
}
