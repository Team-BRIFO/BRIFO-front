import { useQueryClient } from '@tanstack/react-query'

import { cancelPendingStockChange } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'

export function useCancelPendingStockChangeMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: cancelPendingStockChange,
    endpoint: 'cancelPendingStockChange',
    responseSchema: ApiResponse,
    getArgs: (): [] => [],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() }),
  })
}
