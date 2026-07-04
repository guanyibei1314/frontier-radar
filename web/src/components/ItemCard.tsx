import { memo, useState } from 'react'
import type { Item } from '../types'
import { TYPE_LABELS } from '../types'
import ScoreBadge from './ScoreBadge'
import DomainTag from './DomainTag'
import BookmarkButton from './BookmarkButton'
import ShareButton from './ShareButton'
import { relativeTime } from '../lib/data'
import { markAsRead, isRead } from '../lib/reading'

interface ItemCardProps {
  item: Item
}

const ItemCard = memo(function ItemCard({ item }: ItemCardProps) {
  const [read, setRead] = useState(() => isRead(item.id))

  const handleClick = () => {
    markAsRead(item.id)
    setRead(true)
  }

  return (
    <article className={`card group ${read ? 'opacity-70' : ''}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-1">
          <ScoreBadge score={item.score} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-100 group-hover:text-primary-300 transition-colors leading-snug">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
            >
              {item.title_zh}
            </a>
          </h3>
          {item.title_raw !== item.title_zh && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">{item.title_raw}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {item.domain.map(d => <DomainTag key={d} domain={d} />)}
            <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
              {TYPE_LABELS[item.type]}
            </span>
            <span className="text-xs text-gray-500">
              {item.source}
            </span>
            <span className="text-xs text-gray-600">
              {relativeTime(item.published_at)}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <BookmarkButton itemId={item.id} />
              <ShareButton title={item.title_zh} url={item.url} />
            </div>
          </div>
          {item.reason && (
            <p className="text-sm text-primary-400/80 mt-2 leading-relaxed">
              💡 {item.reason}
            </p>
          )}
          {item.related && item.related.length > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              另有 {item.related.length} 个来源报道
            </p>
          )}
        </div>
      </div>
    </article>
  )
})

export default ItemCard
