import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import All from './pages/All'
import Health from './pages/Health'
import Bookmarks from './pages/Bookmarks'
import Analytics from './pages/Analytics'
import Digest from './pages/Digest'
import Trending from './pages/Trending'
import ItemDetail from './pages/ItemDetail'
import Performance from './pages/Performance'
import About from './pages/About'
import Settings from './pages/Settings'
import ScrollToTop from './components/ScrollToTop'
import ThemeToggle from './components/ThemeToggle'
import KeyboardHelp from './components/KeyboardHelp'
import MobileNav from './components/MobileNav'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-colors hidden md:block ${
    isActive
      ? 'bg-primary-500/20 text-primary-300'
      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
  }`

export default function App() {
  const navigate = useNavigate()
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

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
          navigate('/digest')
          break
        case '6':
          navigate('/trending')
          break
        case '7':
          navigate('/health')
          break
        case '8':
          navigate('/about')
          break
        case '9':
          navigate('/settings')
          break
        case '0':
          navigate('/performance')
          break
        case '?':
          setShowKeyboardHelp(true)
          break
        case 'Escape':
          setShowKeyboardHelp(false)
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
              <NavLink to="/digest" className={navLinkClass}>日报</NavLink>
              <NavLink to="/trending" className={navLinkClass}>热门</NavLink>
              <NavLink to="/health" className={navLinkClass}>健康</NavLink>
              <NavLink to="/about" className={navLinkClass}>关于</NavLink>
              <NavLink to="/settings" className={navLinkClass}>设置</NavLink>
              <NavLink to="/performance" className={navLinkClass}>性能</NavLink>
            </nav>
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors hidden md:block"
              title="键盘快捷键"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<All />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/digest" element={<Digest />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/health" element={<Health />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </main>
      <ScrollToTop />
      <KeyboardHelp isOpen={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />
    </div>
  )
}
