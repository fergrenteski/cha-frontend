import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Otimizações de build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          router: ['react-router-dom']
        }
      }
    },
    // Comprimir assets
    assetsInlineLimit: 4096,
    // Otimizar chunks
    chunkSizeWarningLimit: 1000
  },
  server: {
    // Pré-build de dependências para dev
    force: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'react-router-dom'
    ]
  }
})
