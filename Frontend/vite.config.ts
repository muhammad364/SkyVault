import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const backendProxy = {
  '/api': {
    target: 'https://localhost:7181',
    changeOrigin: true,
    // ASP.NET Core's local development certificate is not publicly trusted.
    secure: false,
  },
}

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['hardcover-earflap-stingray.ngrok-free.dev'],
    proxy: backendProxy,
  },
  preview: {
    proxy: backendProxy,
  },
  build: {
    // These groups keep optional 3D/charts and control libraries out of unrelated route entry work.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (
            id.includes('/three/') ||
            id.includes('@react-three') ||
            id.includes('three-stdlib') ||
            id.includes('@pmndrs')
          )
            return 'three-vendor'
          if (id.includes('/recharts/') || id.includes('/d3-')) return 'charts-vendor'
          if (id.includes('@radix-ui')) return 'radix-vendor'
          if (id.includes('react-day-picker') || id.includes('date-fns')) return 'calendar-vendor'
          if (id.includes('framer-motion') || id.includes('motion-dom')) return 'motion-vendor'
          if (id.includes('@tanstack') || id.includes('/axios/') || id.includes('/zustand/'))
            return 'data-vendor'
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router') ||
            id.includes('/scheduler/')
          )
            return 'react-vendor'
          return undefined
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
