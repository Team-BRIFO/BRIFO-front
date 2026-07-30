import { describe, expect, it } from 'vitest'

import { ApiError } from '@/api/client/ApiError'
import {
  createAppQueryClient,
  getQueryRetryDelay,
  shouldRetryQuery,
} from '@/api/client/queryPolicy'

function apiError(kind: ApiError['kind'], status?: number) {
  return new ApiError({
    kind,
    status,
    endpoint: 'getAgents',
    code: kind === 'http' ? `HTTP_${status}` : kind.toUpperCase(),
    message: 'test',
  })
}

describe('TanStack Query policy', () => {
  it.each([400, 401, 403, 404, 409])('does not retry HTTP %s', (status) => {
    expect(shouldRetryQuery(0, apiError('http', status))).toBe(false)
  })

  it('does not retry aborted, contract, or unnormalized mock errors', () => {
    expect(shouldRetryQuery(0, apiError('aborted'))).toBe(false)
    expect(shouldRetryQuery(0, apiError('contract'))).toBe(false)
    expect(shouldRetryQuery(0, new Error('mock failed'))).toBe(false)
  })

  it('retries network and temporary 5xx failures with a hard limit', () => {
    expect(shouldRetryQuery(0, apiError('network'))).toBe(true)
    expect(shouldRetryQuery(1, apiError('network'))).toBe(true)
    expect(shouldRetryQuery(2, apiError('network'))).toBe(false)
    expect(shouldRetryQuery(0, apiError('http', 503))).toBe(true)
    expect(getQueryRetryDelay(20)).toBe(2_000)
  })

  it('defaults Query and Mutation throwOnError to false and Mutation retry to false', () => {
    const queryClient = createAppQueryClient()
    const defaults = queryClient.getDefaultOptions()

    expect(defaults.queries?.throwOnError).toBe(false)
    expect(defaults.mutations?.throwOnError).toBe(false)
    expect(defaults.mutations?.retry).toBe(false)
    queryClient.clear()
  })

  it('keeps existing cache data when a background refetch fails', async () => {
    const queryClient = createAppQueryClient()
    const queryKey = ['agents']
    const cachedData = [{ id: 'agent-1' }]
    queryClient.setQueryData(queryKey, cachedData)

    await expect(
      queryClient.fetchQuery({
        queryKey,
        queryFn: async () => {
          throw apiError('http', 500)
        },
        retry: false,
        staleTime: 0,
      }),
    ).rejects.toBeInstanceOf(ApiError)

    expect(queryClient.getQueryData(queryKey)).toEqual(cachedData)
    queryClient.clear()
  })
})
