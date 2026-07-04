import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import All from './pages/All'
import Health from './pages/Health'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary-500/20 text-primary-300'
      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
  }`

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-100">
            <span className="text-primary-400">⚡</span> FrontierRadar
          </h1>
          <nav className="flex gap-1">
            <NavLink to="/" className={navLinkClass} end>精选</NavLink>
            <NavLink to="/all" className={navLinkClass}>全部</NavLink>
            <NavLink to="/health" className={navLinkClass}>健康</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<All />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </main>
    </div>
  )
}
