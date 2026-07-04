import { useState, useEffect, useMemo } from 'react'
import type { Domain, ItemType, FeedData } from '../types'
import { fetchFeed, fetchMeta } from '../lib/data'
import FilterBar from '../components/FilterBar'
import ItemCard from '../components/ItemCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import SourceHealthFooter from '../components/SourceHealthFooter'

export default function Home() {
  const [data, setData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [domains, setDomains] = useState<Domain[]>([])
  const [types, setTypes] = useState<ItemType[]>([])
  const [health, setHealth] = useState<any[]>([])

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
      return true
    })
  }, [data, domains, types])

  const toggleDomain = (d: Domain) => setDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  const toggleType = (t: ItemType) => setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 mb-1">精选 Feed</h2>
        <p className="text-sm text-gray-500">
          {data?.generated_at && `更新于 ${new Date(data.generated_at).toLocaleString('zh-CN')}`}
          {' · '}{filtered.length} 条
        </p>
      </div>

      <FilterBar
        selectedDomains={domains}
        selectedTypes={types}
        onDomainToggle={toggleDomain}
        onTypeToggle={toggleType}
      />

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <EmptyState message="今日暂无 ≥60 分的条目，换个筛选试试" />
        ) : (
          filtered.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>

      <SourceHealthFooter health={health} />
    </div>
  )
}
