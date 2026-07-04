import { useState } from 'react'

interface ShareButtonProps {
  title: string
  url: string
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareOptions = [
    {
      name: '复制链接',
      action: async () => {
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          const textArea = document.createElement('textarea')
          textArea.value = url
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      },
    },
    {
      name: 'Twitter',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
      },
    },
    {
      name: '微信',
      action: async () => {
        try {
          await navigator.clipboard.writeText(`${title}\n${url}`)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
          alert('链接已复制，请粘贴到微信分享')
        } catch {
          alert('请手动复制链接分享')
        }
      },
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-xs text-gray-600 hover:text-primary-400 transition-colors"
        title="分享"
      >
        📤 分享
      </button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
            {shareOptions.map((option, index) => (
              <button
                key={option.name}
                onClick={() => {
                  option.action()
                  setShowMenu(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${index === shareOptions.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                {option.name === '复制链接' && copied ? '✓ 已复制' : option.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
