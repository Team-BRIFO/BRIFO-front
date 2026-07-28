import { useMutation } from '@tanstack/react-query'

import { deleteMyAccount } from '@/api/user'

export function useDeleteMyAccountMutation() {
  return useMutation({ mutationFn: deleteMyAccount })
}
