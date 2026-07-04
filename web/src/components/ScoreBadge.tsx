interface ScoreBadgeProps {
  score: number
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const color =
    score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    score >= 60 ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
    score >= 40 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
    'bg-gray-500/20 text-gray-400 border-gray-500/30'

  return (
    <div className={`score-badge border ${color}`}>
      {score}
    </div>
  )
}
