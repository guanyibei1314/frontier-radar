import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '精选', icon: '⚡' },
  { to: '/all', label: '全部', icon: '📋' },
  { to: '/bookmarks', label: '收藏', icon: '⭐' },
  { to: '/analytics', label: '分析', icon: '📊' },
  { to: '/digest', label: '日报', icon: '📰' },
  { to: '/trending', label: '热门', icon: '🔥' },
  { to: '/health', label: '健康', icon: '💚' },
  { to: '/about', label: '关于', icon: 'ℹ️' },
  { to: '/settings', label: '设置', icon: '⚙️' },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
        aria-label="菜单"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-gray-100">菜单</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {navItems.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500/20 text-primary-300'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
