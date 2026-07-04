import { useState, useEffect } from 'react'

interface BookmarkButtonProps {
  itemId: string
}

export default function BookmarkButton({ itemId }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setBookmarked(bookmarks.includes(itemId))
  }, [itemId])

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    if (bookmarked) {
      const newBookmarks = bookmarks.filter((id: string) => id !== itemId)
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
      setBookmarked(false)
    } else {
      bookmarks.push(itemId)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
      setBookmarked(true)
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      className={`text-xs transition-colors ${
        bookmarked ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
      }`}
      title={bookmarked ? '取消收藏' : '收藏'}
    >
      {bookmarked ? '★' : '☆'}
    </button>
  )
}
