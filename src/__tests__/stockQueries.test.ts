import { beforeEach, describe, expect, it, vi } from 'vitest'

const hookMocks = vi.hoisted(() => ({
  useApiQuery: vi.fn<(options: unknown) => unknown>(),
}))

vi.mock('@/hooks/api', () => hookMocks)

import { useGetStocksQuery } from '@/hooks/queries/stock/useStockQueries'

interface QueryOptions {
  endpoint: string
  response: string
  enabled: boolean
  args: unknown
}

describe('stock query hook', () => {
  beforeEach(() => {
    hookMocks.useApiQuery.mockImplementation((options) => options)
  })

  it('uses the generated popular-stock endpoint when the profile stock picker opens', () => {
    const params = { request: { size: 20 } }
    const options = useGetStocksQuery(params, true) as unknown as QueryOptions

    expect(options).toMatchObject({
      endpoint: 'getStocks',
      response: 'requiredResult',
      enabled: true,
      args: [params],
    })
  })

  it('does not fetch stocks before the profile needed to preserve existing selections is loaded', () => {
    const options = useGetStocksQuery({ request: { size: 20 } }, false) as unknown as QueryOptions

    expect(options.enabled).toBe(false)
  })
})
