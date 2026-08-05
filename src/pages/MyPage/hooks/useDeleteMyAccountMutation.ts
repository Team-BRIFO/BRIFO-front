import { useQueryClient } from '@tanstack/react-query'

import { deleteUser } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'

export function useDeleteMyAccountMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: deleteUser,
    endpoint: 'deleteUser',
    responseSchema: ApiResponse,
    getArgs: (): [] => [],
    onSuccess: () => queryClient.clear(),
  })
}
