import { useState, useEffect } from 'react'

interface NotificationProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose: () => void
}

export default function Notification({ message, type = 'info', duration = 3000, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    info: 'bg-blue-500/10 border-blue-500/20',
    success: 'bg-emerald-500/10 border-emerald-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    error: 'bg-red-500/10 border-red-500/20',
  }[type]

  const textColor = {
    info: 'text-blue-300',
    success: 'text-emerald-300',
    warning: 'text-yellow-300',
    error: 'text-red-300',
  }[type]

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm p-4 rounded-lg border ${bgColor} transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-sm ${textColor}`}>{message}</span>
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-gray-400 hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
