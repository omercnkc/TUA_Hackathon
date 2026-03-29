import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  },
  preview: {
    port: 4173,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: {
        ui: resolve(__dirname, 'index.html'),
        engine: resolve(__dirname, 'engine.html')
      }
    }
  }
})
