import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { setupErrorTracking } from './lib/errors'
import { measurePageLoad } from './lib/performance'

// Setup error tracking
setupErrorTracking()

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered:', registration.scope)
      },
      (error) => {
        console.log('SW registration failed:', error)
      }
    )
  })
}

// Measure page load performance
window.addEventListener('load', () => {
  setTimeout(measurePageLoad, 0)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
