import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    holdUntilCrawlEnd: false, // Vite 7 optimization
  },
  server: {
    warmup: {
      clientFiles: ['./src/App.tsx', './src/main.tsx'],
    },
  },
})
