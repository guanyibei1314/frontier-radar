import type { Domain } from '../types'
import { DOMAIN_LABELS, DOMAIN_COLORS } from '../types'

interface DomainTagProps {
  domain: Domain
}

export default function DomainTag({ domain }: DomainTagProps) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${DOMAIN_COLORS[domain]}`}>
      {DOMAIN_LABELS[domain]}
    </span>
  )
}
