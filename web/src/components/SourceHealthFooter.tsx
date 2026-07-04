import type { SourceHealth } from '../types'

interface SourceHealthFooterProps {
  health: SourceHealth[]
}

export default function SourceHealthFooter({ health }: SourceHealthFooterProps) {
  if (!health || health.length === 0) return null

  const okCount = health.filter(s => s.ok).length
  const failCount = health.filter(s => !s.ok).length

  return (
    <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800/40">
      <h3 className="text-sm font-medium text-gray-400 mb-3">
        信源健康状态 ({okCount} 正常 / {failCount} 异常)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {health.map(s => (
          <div
            key={s.name}
            className={`text-xs px-3 py-2 rounded-lg border ${
              s.ok
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            <div className="font-medium truncate">{s.name}</div>
            <div className="text-gray-500 mt-0.5">
              {s.ok ? `${s.count} 条` : s.error || '异常'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
