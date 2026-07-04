import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { FeedData, Item } from '../types'
import { fetchFeed, relativeTime } from '../lib/data'
import { markAsRead, isRead } from '../lib/reading'
import { recordView, getViewCount } from '../lib/trending'
import ScoreBadge from '../components/ScoreBadge'
import DomainTag from '../components/DomainTag'
import BookmarkButton from '../components/BookmarkButton'
import ShareButton from '../components/ShareButton'
import { TYPE_LABELS } from '../types'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorState from '../components/ErrorState'

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [read, setRead] = useState(false)
  const [viewCount, setViewCount] = useState(0)

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

  useEffect(() => {
    load()
    if (id) {
      setRead(isRead(id))
      recordView(id)
      setViewCount(getViewCount(id))
    }
  }, [id])

  const item = data?.items.find(i => i.id === id)

  const handleOpenLink = () => {
    if (item) {
      markAsRead(item.id)
      setRead(true)
      window.open(item.url, '_blank')
    }
  }

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-100 mb-2">条目未找到</h2>
        <p className="text-gray-400 mb-4">该条目可能已被移除或不存在</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors mb-4"
        >
          ← 返回
        </button>
      </div>

      <article className={`card ${read ? 'opacity-70' : ''}`}>
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <ScoreBadge score={item.score} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-100 leading-tight mb-2">
              {item.title_zh}
            </h1>
            {item.title_raw !== item.title_zh && (
              <p className="text-lg text-gray-400 mb-4">{item.title_raw}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {item.domain.map(d => <DomainTag key={d} domain={d} />)}
              <span className="text-sm text-gray-500 bg-gray-800/50 px-3 py-1 rounded">
                {TYPE_LABELS[item.type]}
              </span>
              <span className="text-sm text-gray-500">
                {item.source}
              </span>
              <span className="text-sm text-gray-600">
                {relativeTime(item.published_at)}
              </span>
              <span className="text-sm text-gray-600">
                浏览 {viewCount} 次
              </span>
            </div>

            {item.reason && (
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6">
                <p className="text-primary-300 leading-relaxed">
                  💡 {item.reason}
                </p>
              </div>
            )}

            {item.summary_zh && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">摘要</h3>
                <p className="text-gray-300 leading-relaxed">
                  {item.summary_zh}
                </p>
              </div>
            )}

            {/* Score Details */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">评分明细</h3>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: '相关性', value: item.score_detail.relevance, color: 'text-blue-400' },
                  { label: '重要性', value: item.score_detail.significance, color: 'text-emerald-400' },
                  { label: '新颖度', value: item.score_detail.novelty, color: 'text-purple-400' },
                  { label: '权威度', value: item.score_detail.authority, color: 'text-amber-400' },
                  { label: '时效性', value: item.score_detail.recency, color: 'text-red-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className={`text-xl font-bold ${color}`}>{value}</div>
                    <div className="text-xs text-gray-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Sources */}
            {item.related && item.related.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">相关报道</h3>
                <div className="space-y-2">
                  {item.related.map((rel, index) => (
                    <a
                      key={index}
                      href={rel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      <span className="text-gray-600">•</span>
                      <span>{rel.source}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
              <button
                onClick={handleOpenLink}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                阅读原文
              </button>
              <BookmarkButton itemId={item.id} />
              <ShareButton title={item.title_zh} url={item.url} />
            </div>
          </div>
        </div>
      </article>

      {/* Metadata */}
      <div className="mt-6 card">
        <h3 className="text-sm font-medium text-gray-400 mb-3">元数据</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">ID:</span>
            <span className="text-gray-300 ml-2 font-mono">{item.id}</span>
          </div>
          <div>
            <span className="text-gray-500">发布时间:</span>
            <span className="text-gray-300 ml-2">{new Date(item.published_at).toLocaleString('zh-CN')}</span>
          </div>
          <div>
            <span className="text-gray-500">抓取时间:</span>
            <span className="text-gray-300 ml-2">{new Date(item.fetched_at).toLocaleString('zh-CN')}</span>
          </div>
          <div>
            <span className="text-gray-500">信源权威度:</span>
            <span className="text-gray-300 ml-2">{item.source_authority}/5</span>
          </div>
        </div>
      </div>
    </div>
  )
}
