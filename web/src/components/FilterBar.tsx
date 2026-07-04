import type { Domain, ItemType } from '../types'
import { DOMAIN_LABELS, DOMAIN_COLORS, TYPE_LABELS } from '../types'

interface FilterBarProps {
  selectedDomains: Domain[]
  selectedTypes: ItemType[]
  onDomainToggle: (d: Domain) => void
  onTypeToggle: (t: ItemType) => void
}

export default function FilterBar({ selectedDomains, selectedTypes, onDomainToggle, onTypeToggle }: FilterBarProps) {
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
    </div>
  )
}
