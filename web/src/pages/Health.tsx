import { useState, useEffect } from 'react'
import type { MetaData } from '../types'
import { fetchMeta } from '../lib/data'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Health() {
  const [meta, setMeta] = useState<MetaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMeta()
      setMeta(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!meta) return null

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 mb-1">流水线健康状态</h2>
        <p className="text-sm text-gray-500">
          最近运行: {new Date(meta.last_run).toLocaleString('zh-CN')}
        </p>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: '抓取总数', value: meta.counts.fetched, color: 'text-blue-400' },
          { label: '预筛后', value: meta.counts.after_prefilter, color: 'text-cyan-400' },
          { label: '去重后', value: meta.counts.after_dedup, color: 'text-teal-400' },
          { label: 'LLM 调用', value: meta.counts.llm_calls, color: 'text-purple-400' },
          { label: '精选条数', value: meta.counts.feed_count, color: 'text-emerald-400' },
          { label: '全部条数', value: meta.counts.all_count, color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Source Health */}
      <h3 className="text-lg font-semibold text-gray-200 mb-4">信源状态</h3>
      <div className="space-y-2">
        {meta.source_health.map(s => (
          <div
            key={s.name}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              s.ok
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-red-500/5 border-red-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-gray-200 font-medium">{s.name}</span>
            </div>
            <div className="text-sm text-gray-400">
              {s.ok ? `${s.count} 条` : s.error || '异常'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
