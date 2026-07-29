import { defineConfig } from 'orval'

export default defineConfig({
  brifo: {
    input: {
      target: 'https://api.example.com/v3/api-docs',
    },
    output: {
      target: './src/api/generated/endpoints',
      schemas: {
        path: './src/api/generated/schemas',
        type: 'zod',
        splitByTags: true,
      },
      client: 'axios-functions',
      mode: 'tags-split',
      // Keep generated paths relative. The Axios instance owns the runtime base URL.
      baseUrl: '',
      clean: true,
      formatter: 'prettier',
      override: {
        mutator: {
          path: './src/api/client/axiosInstance.ts',
          name: 'axiosInstance',
          // Runtime-only Vite environment access must not be bundled by Orval.
          external: [
            '@/api/client/paramsSerializer',
            '@/api/client/result',
            '@/api/client/runtimeConfig',
            '@/api/client/tokenStore',
            '@/api/generated/schemas',
          ],
        },
        zod: {
          version: 4,
        },
      },
    },
  },
})
