import { useQueryClient } from '@tanstack/react-query'

import { getTerm, saveTerm } from '@/api/generated/endpoints/term-controller/term-controller'
import { ApiResponse } from '@/api/generated/schemas'
import { ApiResponseGetTermResponse } from '@/api/generated/schemas/term-controller'
import { useApiMutation, useApiQuery } from '@/hooks/api'
import { termQueryKeys } from '@/hooks/queries/term/termQueryKeys'
import { mapTermDetail } from '@/mappers/termMapper'

export function useGetTermDetail(termId: string | null) {
  return useApiQuery({
    queryKey: termQueryKeys.detail(termId ?? ''),
    operation: getTerm,
    endpoint: 'getTerm',
    args: [termId ?? ''],
    responseSchema: ApiResponseGetTermResponse,
    response: 'requiredResult',
    map: (result) => mapTermDetail(result),
    enabled: Boolean(termId),
    staleTime: 0,
  })
}

export function usePutMyTerm() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: saveTerm,
    endpoint: 'saveTerm',
    responseSchema: ApiResponse,
    response: 'body',
    getArgs: (termId: string) => [termId] as const,
    onSuccess: async (_, termId) => {
      // Both invalidations must complete before mutation settles,
      // so duplicate saves while refetch is in-flight are prevented.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: termQueryKeys.detail(termId) }),
        queryClient.invalidateQueries({ queryKey: termQueryKeys.all }),
      ])
    },
  })
}
