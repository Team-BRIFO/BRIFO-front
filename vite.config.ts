import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

function rewriteProxyCookie(cookie: string) {
  const hasPath = /;\s*path=/i.test(cookie)

  return cookie
    .replace(/^__Host-/i, '')
    .replace(/;\s*domain=[^;]+/gi, '')
    .replace(/;\s*secure/gi, '')
    .replace(/;\s*samesite=[^;]+/gi, '; SameSite=Lax')
    .replace(/;\s*path=[^;]+/gi, '; Path=/')
    .concat(hasPath ? '' : '; Path=/')
}

function rewriteProxyCookies(setCookie: string | string[] | undefined): string[] | undefined {
  if (!setCookie) return undefined

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
  return cookies.map(rewriteProxyCookie)
}

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
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const rewritten = rewriteProxyCookies(proxyRes.headers['set-cookie'])
              if (rewritten) {
                proxyRes.headers['set-cookie'] = rewritten
              }
            })
          },
        },
      },
    },
  }
})
