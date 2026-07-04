import { useState, useEffect } from 'react'

interface KeyboardHelpProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { key: '1', description: '精选 Feed' },
  { key: '2', description: '全部动态' },
  { key: '3', description: '收藏夹' },
  { key: '4', description: '数据分析' },
  { key: '5', description: '健康状态' },
  { key: '?', description: '显示快捷键帮助' },
  { key: 'Esc', description: '关闭弹窗' },
]

export default function KeyboardHelp({ isOpen, onClose }: KeyboardHelpProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">键盘快捷键</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-300">{description}</span>
              <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-400 font-mono">
                {key}
              </kbd>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  )
}
