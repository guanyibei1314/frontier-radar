import { useState, useEffect } from 'react'
import type { FeedData } from '../types'
import { fetchFeed } from '../lib/data'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorState from '../components/ErrorState'

interface ChartBarProps {
  label: string
  value: number
  maxValue: number
  color: string
}

function ChartBar({ label, value, maxValue, color }: ChartBarProps) {
  const percentage = (value / maxValue) * 100
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-right text-sm text-gray-400 truncate">{label}</div>
      <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-12 text-sm text-gray-300 text-right">{value}</div>
    </div>
  )
}

export default function Analytics() {
  const [data, setData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return null

  // Calculate statistics
  const scores = data.items.map(i => i.score)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const maxScore = Math.max(...scores)
  const minScore = Math.min(...scores)

  // Domain distribution
  const domains: Record<string, number> = {}
  data.items.forEach(item => {
    item.domain.forEach(d => {
      domains[d] = (domains[d] || 0) + 1
    })
  })

  // Type distribution
  const types: Record<string, number> = {}
  data.items.forEach(item => {
    types[item.type] = (types[item.type] || 0) + 1
  })

  // Source distribution
  const sources: Record<string, number> = {}
  data.items.forEach(item => {
    sources[item.source] = (sources[item.source] || 0) + 1
  })

  // Score distribution by range
  const scoreRanges: Record<string, number> = {
    '90-100': 0,
    '80-89': 0,
    '70-79': 0,
    '60-69': 0,
    '50-59': 0,
  }
  data.items.forEach(item => {
    if (item.score >= 90) scoreRanges['90-100']++
    else if (item.score >= 80) scoreRanges['80-89']++
    else if (item.score >= 70) scoreRanges['70-79']++
    else if (item.score >= 60) scoreRanges['60-69']++
    else scoreRanges['50-59']++
  })

  const maxDomain = Math.max(...Object.values(domains))
  const maxType = Math.max(...Object.values(types))
  const maxSource = Math.max(...Object.values(sources))
  const maxScoreRange = Math.max(...Object.values(scoreRanges))

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 mb-1">数据分析</h2>
        <p className="text-sm text-gray-500">
          {data.items.length} 条目 · 平均分 {avgScore.toFixed(1)}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: '总条目', value: data.items.length, color: 'text-blue-400' },
          { label: '平均分', value: avgScore.toFixed(1), color: 'text-emerald-400' },
          { label: '最高分', value: maxScore, color: 'text-yellow-400' },
          { label: '最低分', value: minScore, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Score Distribution */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">分数分布</h3>
        <div className="space-y-3">
          {Object.entries(scoreRanges).map(([range, count]) => (
            <ChartBar
              key={range}
              label={range}
              value={count}
              maxValue={maxScoreRange}
              color="bg-primary-500"
            />
          ))}
        </div>
      </div>

      {/* Domain Distribution */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">领域分布</h3>
        <div className="space-y-3">
          {Object.entries(domains)
            .sort(([, a], [, b]) => b - a)
            .map(([domain, count]) => (
              <ChartBar
                key={domain}
                label={domain}
                value={count}
                maxValue={maxDomain}
                color="bg-emerald-500"
              />
            ))}
        </div>
      </div>

      {/* Type Distribution */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">类型分布</h3>
        <div className="space-y-3">
          {Object.entries(types)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => (
              <ChartBar
                key={type}
                label={type}
                value={count}
                maxValue={maxType}
                color="bg-purple-500"
              />
            ))}
        </div>
      </div>

      {/* Source Distribution */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">信源分布</h3>
        <div className="space-y-3">
          {Object.entries(sources)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([source, count]) => (
              <ChartBar
                key={source}
                label={source}
                value={count}
                maxValue={maxSource}
                color="bg-amber-500"
              />
            ))}
        </div>
      </div>
    </div>
  )
}
