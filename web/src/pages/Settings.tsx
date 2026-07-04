import { useState, useEffect } from 'react'
import type { Domain, ItemType } from '../types'
import { DOMAIN_LABELS, TYPE_LABELS } from '../types'
import { getPreferences, savePreferences, resetPreferences } from '../lib/preferences'
import { clearCache } from '../lib/cache'
import { clearReadHistory } from '../lib/reading'
import { clearViewHistory } from '../lib/trending'
import { clearSearchHistory } from '../lib/search'
import { clearErrors } from '../lib/errors'
import { clearMetrics } from '../lib/performance'
import { getNotificationConfig, saveNotificationConfig, resetNotificationConfig, requestNotificationPermission } from '../lib/notifications'

export default function Settings() {
  const [prefs, setPrefs] = useState(getPreferences())
  const [notifConfig, setNotifConfig] = useState(getNotificationConfig())
  const [saved, setSaved] = useState(false)
  const [notifPermission, setNotifPermission] = useState<string>('default')

  useEffect(() => {
    setPrefs(getPreferences())
    setNotifConfig(getNotificationConfig())
    if ('Notification' in window) {
      setNotifPermission(Notification.permission)
    }
  }, [])

  const handleSave = () => {
    savePreferences(prefs)
    saveNotificationConfig(notifConfig)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    resetPreferences()
    resetNotificationConfig()
    setPrefs(getPreferences())
    setNotifConfig(getNotificationConfig())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearCache = () => {
    clearCache()
    alert('缓存已清除')
  }

  const handleClearReadHistory = () => {
    clearReadHistory()
    alert('阅读历史已清除')
  }

  const handleClearViewHistory = () => {
    clearViewHistory()
    alert('浏览历史已清除')
  }

  const handleClearSearchHistory = () => {
    clearSearchHistory()
    alert('搜索历史已清除')
  }

  const handleClearErrors = () => {
    clearErrors()
    alert('错误记录已清除')
  }

  const handleClearMetrics = () => {
    clearMetrics()
    alert('性能指标已清除')
  }

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission()
    setNotifPermission(granted ? 'granted' : 'denied')
  }

  const allDomains: Domain[] = ['ai', 'embodied', 'drone']
  const allTypes: ItemType[] = ['model', 'product', 'paper', 'industry', 'tool', 'opinion']

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 mb-1">设置</h2>
        <p className="text-sm text-gray-500">个性化你的 FrontierRadar</p>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">主题</h3>
          <div className="flex gap-4">
            {(['dark', 'light'] as const).map(theme => (
              <button
                key={theme}
                onClick={() => setPrefs(prev => ({ ...prev, theme }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  prefs.theme === theme
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {theme === 'dark' ? '暗色' : '亮色'}
              </button>
            ))}
          </div>
        </div>

        {/* Default Domains */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">默认领域筛选</h3>
          <div className="flex flex-wrap gap-2">
            {allDomains.map(domain => (
              <button
                key={domain}
                onClick={() => {
                  setPrefs(prev => ({
                    ...prev,
                    defaultDomains: prev.defaultDomains.includes(domain)
                      ? prev.defaultDomains.filter(d => d !== domain)
                      : [...prev.defaultDomains, domain],
                  }))
                }}
                className={`chip ${
                  prefs.defaultDomains.includes(domain) ? 'chip-active' : 'chip-inactive'
                }`}
              >
                {DOMAIN_LABELS[domain]}
              </button>
            ))}
          </div>
        </div>

        {/* Default Types */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">默认类型筛选</h3>
          <div className="flex flex-wrap gap-2">
            {allTypes.map(type => (
              <button
                key={type}
                onClick={() => {
                  setPrefs(prev => ({
                    ...prev,
                    defaultTypes: prev.defaultTypes.includes(type)
                      ? prev.defaultTypes.filter(t => t !== type)
                      : [...prev.defaultTypes, type],
                  }))
                }}
                className={`chip ${
                  prefs.defaultTypes.includes(type) ? 'chip-active' : 'chip-inactive'
                }`}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Min Score */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">默认最低分数</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={prefs.defaultMinScore}
              onChange={e => setPrefs(prev => ({ ...prev, defaultMinScore: Number(e.target.value) }))}
              className="w-64 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-gray-300 w-12">{prefs.defaultMinScore}</span>
          </div>
        </div>

        {/* Items Per Page */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">每页条目数</h3>
          <div className="flex gap-4">
            {[10, 20, 50, 100].map(count => (
              <button
                key={count}
                onClick={() => setPrefs(prev => ({ ...prev, itemsPerPage: count }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  prefs.itemsPerPage === count
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Reading Options */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">阅读选项</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={prefs.showReadItems}
                onChange={e => setPrefs(prev => ({ ...prev, showReadItems: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-gray-300">显示已读条目</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={prefs.autoMarkAsRead}
                onChange={e => setPrefs(prev => ({ ...prev, autoMarkAsRead: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-gray-300">点击链接自动标记为已读</span>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">通知设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">浏览器通知</span>
              {notifPermission === 'granted' ? (
                <span className="text-sm text-emerald-400">已授权</span>
              ) : notifPermission === 'denied' ? (
                <span className="text-sm text-red-400">已拒绝</span>
              ) : (
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-1 rounded text-sm bg-primary-600 text-white hover:bg-primary-700"
                >
                  请求授权
                </button>
              )}
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifConfig.enabled}
                onChange={e => setNotifConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-gray-300">启用通知</span>
            </label>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">高分阈值</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={notifConfig.highScoreThreshold}
                  onChange={e => setNotifConfig(prev => ({ ...prev, highScoreThreshold: Number(e.target.value) }))}
                  className="w-64 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-300 w-12">{notifConfig.highScoreThreshold}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">数据管理</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={handleClearCache}
              className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              清除缓存
            </button>
            <button
              onClick={handleClearReadHistory}
              className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              清除阅读历史
            </button>
            <button
              onClick={handleClearViewHistory}
              className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              清除浏览历史
            </button>
            <button
              onClick={handleClearSearchHistory}
              className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              清除搜索历史
            </button>
            <button
              onClick={handleClearErrors}
              className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              清除错误记录
            </button>
            <button
              onClick={handleClearMetrics}
              className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              清除性能指标
            </button>
          </div>
        </div>

        {/* Reset */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">重置</h3>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-sm bg-red-900/50 text-red-300 hover:bg-red-900/80 transition-colors"
          >
            重置所有设置
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            {saved ? '✓ 已保存' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  )
}
