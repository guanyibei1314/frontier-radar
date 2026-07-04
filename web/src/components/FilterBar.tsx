import type { Domain, ItemType } from '../types'
import { DOMAIN_LABELS, DOMAIN_COLORS, TYPE_LABELS } from '../types'

interface FilterBarProps {
  selectedDomains: Domain[]
  selectedTypes: ItemType[]
  onDomainToggle: (d: Domain) => void
  onTypeToggle: (t: ItemType) => void
  minScore?: number
  onMinScoreChange?: (score: number) => void
}

export default function FilterBar({
  selectedDomains,
  selectedTypes,
  onDomainToggle,
  onTypeToggle,
  minScore = 0,
  onMinScoreChange
}: FilterBarProps) {
  const allDomains: Domain[] = ['ai', 'embodied', 'drone']
  const allTypes: ItemType[] = ['model', 'product', 'paper', 'industry', 'tool', 'opinion']

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500 mr-1">领域</span>
        {allDomains.map(d => (
          <button
            key={d}
            onClick={() => onDomainToggle(d)}
            className={`chip ${selectedDomains.includes(d) ? DOMAIN_COLORS[d] : 'chip-inactive'}`}
          >
            {DOMAIN_LABELS[d]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500 mr-1">类型</span>
        {allTypes.map(t => (
          <button
            key={t}
            onClick={() => onTypeToggle(t)}
            className={`chip ${selectedTypes.includes(t) ? 'chip-active' : 'chip-inactive'}`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>
      {onMinScoreChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">最低分数</span>
          <input
            type="range"
            min="0"
            max="100"
            value={minScore}
            onChange={e => onMinScoreChange(Number(e.target.value))}
            className="w-32 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-8">{minScore}</span>
        </div>
      )}
    </div>
  )
}
