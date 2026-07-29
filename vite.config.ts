import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '.', '')
  const apiBaseUrl = environment.VITE_API_BASE_URL

  if (!apiBaseUrl) {
    throw new Error(
      'VITE_API_BASE_URL is required. Copy .env.example to .env and set the API base URL.',
    )
  }

  return {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
