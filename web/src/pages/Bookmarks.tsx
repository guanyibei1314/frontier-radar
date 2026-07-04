import { useState, useEffect } from 'react'
import type { FeedData, Item } from '../types'
import { fetchFeed } from '../lib/data'
import ItemCard from '../components/ItemCard'
import EmptyState from '../components/EmptyState'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Bookmarks() {
  const [data, setData] = useState<FeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const feed = await fetchFeed()
        setData(feed)
      } catch (e) {
        console.error('Failed to load feed:', e)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Load bookmarks from localStorage
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setBookmarks(savedBookmarks)

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
      setBookmarks(updatedBookmarks)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const bookmarkedItems = data?.items.filter(item => bookmarks.includes(item.id)) || []

  if (loading) return <LoadingSkeleton />

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 mb-1">收藏夹</h2>
        <p className="text-sm text-gray-500">
          {bookmarkedItems.length} 条收藏
        </p>
      </div>

      <div className="space-y-4">
        {bookmarkedItems.length === 0 ? (
          <EmptyState message="还没有收藏任何条目，点击 ☆ 按钮收藏" />
        ) : (
          bookmarkedItems.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
}
