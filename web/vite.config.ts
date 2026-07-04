import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/data': {
        target: 'http://localhost:5173',
        rewrite: (path) => path,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
