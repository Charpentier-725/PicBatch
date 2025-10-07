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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': [
            '@radix-ui/react-slider',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-toast',
            '@radix-ui/react-progress',
            '@radix-ui/react-separator',
            '@radix-ui/react-alert-dialog',
          ],
          // browser-image-compression 使用动态导入，不在这里打包
          'vendor-image': ['heic2any'],
          'vendor-zip': ['jszip', 'file-saver'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // 提高警告阈值
  },
})
