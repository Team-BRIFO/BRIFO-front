import { QueryClient } from '@tanstack/react-query'

import { ApiError } from '@/api/client/ApiError'

export const MAX_QUERY_RETRIES = 2
export const MAX_RETRY_DELAY_MS = 2_000

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= MAX_QUERY_RETRIES || !(error instanceof ApiError)) return false
  if (error.kind === 'aborted' || error.kind === 'contract') return false
  if (error.kind === 'network') return true
  return error.kind === 'http' && error.status !== undefined && error.status >= 500
}

export function getQueryRetryDelay(attemptIndex: number) {
  return Math.min(500 * 2 ** attemptIndex, MAX_RETRY_DELAY_MS)
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetryQuery,
        retryDelay: getQueryRetryDelay,
        throwOnError: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
        throwOnError: false,
      },
    },
  })
}
