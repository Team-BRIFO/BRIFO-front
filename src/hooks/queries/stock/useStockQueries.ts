import { getStocks } from '@/api/generated/endpoints/stock-controller/stock-controller'
import type { GetStocksParams } from '@/api/generated/schemas'
import { ApiResponseGetStocksResponse } from '@/api/generated/schemas/stock-controller'
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
    responseSchema: ApiResponseGetStocksResponse,
    response: 'requiredResult',
    args: [params],
  })
}
