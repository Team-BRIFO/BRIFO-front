import { beforeEach, describe, expect, it, vi } from 'vitest'

const hookMocks = vi.hoisted(() => ({
  useApiInfiniteQuery: vi.fn<(options: unknown) => unknown>(),
}))

vi.mock('@/hooks/api', () => hookMocks)

import { useGetStocksQuery } from '@/hooks/queries/stock/useStockQueries'

interface QueryOptions {
  endpoint: string
  response: string
  enabled: boolean
  queryKey: readonly unknown[]
  getArgs: (context: { pageParam: string | null }) => unknown
  getNextPageParam: (page: { page: { hasNext: boolean; nextCursor?: string } }) => unknown
}

describe('stock query hook', () => {
  beforeEach(() => {
    hookMocks.useApiInfiniteQuery.mockImplementation((options) => options)
  })

  it('uses the generated stock endpoint with the current search keyword and first cursor page', () => {
    const options = useGetStocksQuery('브리포테크', 20, true) as unknown as QueryOptions

    expect(options).toMatchObject({
      endpoint: 'getStocks',
      response: 'requiredResult',
      enabled: true,
    })
    expect(options.queryKey).toEqual(['stocks', 'list', { keyword: '브리포테크', size: 20 }])
    expect(options.getArgs({ pageParam: null })).toEqual([
      { request: { keyword: '브리포테크', cursor: undefined, size: 20 } },
    ])
    expect(options.getNextPageParam({ page: { hasNext: true, nextCursor: 'next-cursor' } })).toBe(
      'next-cursor',
    )
  })

  it('does not fetch stocks before the profile needed to preserve existing selections is loaded', () => {
    const options = useGetStocksQuery('', 20, false) as unknown as QueryOptions

    expect(options.enabled).toBe(false)
  })
})
