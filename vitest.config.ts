import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'

const testApiBaseUrl = process.env.VITE_API_BASE_URL || 'https://api.example.com'

export default defineConfig({
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(testApiBaseUrl),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
})
