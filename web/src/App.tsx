import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import All from './pages/All'
import Health from './pages/Health'
import Bookmarks from './pages/Bookmarks'
import Analytics from './pages/Analytics'
import ScrollToTop from './components/ScrollToTop'
import ThemeToggle from './components/ThemeToggle'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary-500/20 text-primary-300'
      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
  }`

export default function App() {
  const navigate = useNavigate()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case '1':
          navigate('/')
          break
        case '2':
          navigate('/all')
          break
        case '3':
          navigate('/bookmarks')
          break
        case '4':
          navigate('/analytics')
          break
        case '5':
          navigate('/health')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950 light:bg-gray-50">
      <header className="sticky top-0 z-50 bg-gray-950/90 dark:bg-gray-950/90 light:bg-white/90 backdrop-blur border-b border-gray-800/50 dark:border-gray-800/50 light:border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">
            <span className="text-primary-400">⚡</span> FrontierRadar
          </h1>
          <div className="flex items-center gap-2">
            <nav className="flex gap-1">
              <NavLink to="/" className={navLinkClass} end>精选</NavLink>
              <NavLink to="/all" className={navLinkClass}>全部</NavLink>
              <NavLink to="/bookmarks" className={navLinkClass}>收藏</NavLink>
              <NavLink to="/analytics" className={navLinkClass}>分析</NavLink>
              <NavLink to="/health" className={navLinkClass}>健康</NavLink>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<All />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </main>
      <ScrollToTop />
    </div>
  )
}
