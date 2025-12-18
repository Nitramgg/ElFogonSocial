// Este es el lugar correcto para el bloque que pasaste
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
      manifest: {
        // ... aquí va todo el bloque del manifest que pusiste ...
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    }
  }
})