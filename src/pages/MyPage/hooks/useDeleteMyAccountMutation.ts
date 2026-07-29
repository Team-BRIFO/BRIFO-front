import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteMyAccount } from '@/api/user'

export function useDeleteMyAccountMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => queryClient.clear(),
  })
}
