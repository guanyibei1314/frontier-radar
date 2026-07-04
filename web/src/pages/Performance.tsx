import { useState, useEffect } from 'react'
import { getMetrics, getAverageMetric, clearMetrics } from '../lib/performance'

interface MetricSummary {
  name: string
  avg: number
  min: number
  max: number
  count: number
}

export default function Performance() {
  const [metrics, setMetrics] = useState<MetricSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = () => {
    setLoading(true)
    try {
      const allMetrics = getMetrics()

      // Group by name
      const grouped: Record<string, number[]> = {}
      allMetrics.forEach(m => {
        if (!grouped[m.name]) {
          grouped[m.name] = []
        }
        grouped[m.name].push(m.value)
      })

      // Calculate summaries
      const summaries: MetricSummary[] = Object.entries(grouped).map(([name, values]) => ({
        name,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      }))

      // Sort by count
      summaries.sort((a, b) => b.count - a.count)

      setMetrics(summaries)
    } catch (e) {
      console.error('Failed to load metrics:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    clearMetrics()
    setMetrics([])
  }

  const formatMs = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getMetricColor = (name: string, value: number) => {
    if (name.includes('pageLoad')) {
      if (value < 1000) return 'text-emerald-400'
      if (value < 3000) return 'text-yellow-400'
      return 'text-red-400'
    }
    if (name.includes('api:')) {
      if (value < 200) return 'text-emerald-400'
      if (value < 1000) return 'text-yellow-400'
      return 'text-red-400'
    }
    return 'text-gray-300'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-1">性能监控</h2>
          <p className="text-sm text-gray-500">
            {metrics.length} 个指标
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadMetrics}
            className="px-3 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            刷新
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-lg text-sm bg-red-900/50 text-red-300 hover:bg-red-900/80 transition-colors"
          >
            清除
          </button>
        </div>
      </div>

      {metrics.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-gray-400">暂无性能数据</p>
          <p className="text-sm text-gray-500 mt-2">浏览页面后自动生成</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '页面加载', value: getAverageMetric('pageLoad'), color: 'text-blue-400' },
              { label: 'DOM 加载', value: getAverageMetric('domContentLoaded'), color: 'text-emerald-400' },
              { label: '首次渲染', value: getAverageMetric('firstPaint'), color: 'text-purple-400' },
              { label: '总指标数', value: metrics.reduce((a, b) => a + b.count, 0), color: 'text-amber-400', unit: '个' },
            ].map(({ label, value, color, unit }) => (
              <div key={label} className="card text-center">
                <div className={`text-2xl font-bold ${color}`}>
                  {unit ? value.toFixed(0) : formatMs(value)}
                  {unit && <span className="text-sm ml-1">{unit}</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Detailed Metrics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">详细指标</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="pb-3 pr-4">指标名称</th>
                    <th className="pb-3 pr-4">平均值</th>
                    <th className="pb-3 pr-4">最小值</th>
                    <th className="pb-3 pr-4">最大值</th>
                    <th className="pb-3">样本数</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr key={metric.name} className="border-b border-gray-800/50">
                      <td className="py-3 pr-4">
                        <span className="text-sm font-mono text-gray-300">{metric.name}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-sm font-medium ${getMetricColor(metric.name, metric.avg)}`}>
                          {formatMs(metric.avg)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-gray-400">{formatMs(metric.min)}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-gray-400">{formatMs(metric.max)}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-gray-400">{metric.count}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">性能建议</h3>
            <div className="space-y-3">
              {getAverageMetric('pageLoad') > 3000 && (
                <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-red-400">⚠️</span>
                  <p className="text-sm text-red-300">
                    页面加载时间过长（{formatMs(getAverageMetric('pageLoad'))}），建议检查网络连接或清除缓存。
                  </p>
                </div>
              )}
              {getAverageMetric('pageLoad') > 1000 && getAverageMetric('pageLoad') <= 3000 && (
                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <span className="text-yellow-400">💡</span>
                  <p className="text-sm text-yellow-300">
                    页面加载时间一般（{formatMs(getAverageMetric('pageLoad'))}），可考虑优化网络或使用离线模式。
                  </p>
                </div>
              )}
              {getAverageMetric('pageLoad') <= 1000 && getAverageMetric('pageLoad') > 0 && (
                <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <span className="text-emerald-400">✓</span>
                  <p className="text-sm text-emerald-300">
                    页面加载速度良好（{formatMs(getAverageMetric('pageLoad'))}）。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
