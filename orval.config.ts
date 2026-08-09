import { defineConfig } from 'orval'
import { loadEnv } from 'vite'

const environment = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')
const apiBaseUrl = process.env.VITE_API_BASE_URL || environment.VITE_API_BASE_URL
const openApiUrl =
  process.env.ORVAL_OPENAPI_URL ||
  environment.ORVAL_OPENAPI_URL ||
  (apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/v3/api-docs` : undefined)

if (!openApiUrl) {
  throw new Error(
    'ORVAL_OPENAPI_URL or VITE_API_BASE_URL is required. Copy .env.example to .env and set the API base URL.',
  )
}

const INSTANT_DATE_TIME_PATTERN =
  '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$'

type OpenApiSchema = {
  $ref?: string
  format?: string
  pattern?: string
  properties?: Record<string, OpenApiSchema>
  type?: string
}

type OpenApiDocument = {
  components?: {
    schemas?: Record<string, OpenApiSchema>
  }
}

/**
 * The backend exposes KST `LocalDateTime` values as OpenAPI `date-time`, but
 * card-news `publishedDate` is an `Instant` and must keep accepting offsets.
 * Orval applies `dateTimeOptions` globally, so mark that one known Instant as
 * a separate string format before generating LocalDateTime validators.
 */
function preserveInstantDateTimeFormat<T>(spec: T): T {
  const document = spec as OpenApiDocument
  const stockNewsCard = document.components?.schemas?.StockNewsCard

  if (!stockNewsCard || '$ref' in stockNewsCard) return spec

  const publishedDate = stockNewsCard.properties?.publishedDate

  if (
    !publishedDate ||
    '$ref' in publishedDate ||
    publishedDate.type !== 'string' ||
    publishedDate.format !== 'date-time'
  ) {
    return spec
  }

  publishedDate.format = 'instant-date-time'
  publishedDate.pattern = INSTANT_DATE_TIME_PATTERN

  return spec
}

export default defineConfig({
  brifo: {
    input: {
      target: openApiUrl,
      override: {
        transformer: preserveInstantDateTimeFormat,
      },
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
          // KST LocalDateTime is offset-less. Strict offset/seconds validation
          // is added by src/api/contracts/localDateTime.ts at response boundaries.
          dateTimeOptions: {
            local: true,
            offset: false,
          },
        },
      },
    },
  },
})
