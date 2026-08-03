import { z } from 'zod'

import { getStocks } from '@/api/generated/endpoints/stock-controller/stock-controller'
import type { GetStocksParams } from '@/api/generated/schemas'
import { useApiQuery } from '@/hooks/api'

export const stockQueryKeys = {
  all: ['stocks'] as const,
  list: (params: GetStocksParams) => [...stockQueryKeys.all, 'list', params] as const,
}

export function useGetStocksQuery(params: GetStocksParams) {
  return useApiQuery({
    queryKey: stockQueryKeys.list(params),
    operation: getStocks,
    endpoint: 'getStocks',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseSchema: z.any() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: 'requiredResult' as any,
    args: [params],
  })
}
