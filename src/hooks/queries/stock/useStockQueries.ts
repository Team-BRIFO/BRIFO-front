import { getStocks } from '@/api/generated/endpoints/stock-controller/stock-controller'
import { ApiResponseGetStocksResponse, type GetStocksParams } from '@/api/generated/schemas'
import { useApiQuery } from '@/hooks/api'

export const stockQueryKeys = {
  all: ['stocks'] as const,
  list: (params: GetStocksParams) => [...stockQueryKeys.all, 'list', params] as const,
}

export function useGetStocksQuery(params: GetStocksParams, enabled: boolean = true) {
  return useApiQuery({
    queryKey: stockQueryKeys.list(params),
    operation: getStocks,
    endpoint: 'getStocks',
    responseSchema: ApiResponseGetStocksResponse,
    response: 'requiredResult',
    args: [params],
    enabled,
    staleTime: 0,
  })
}
