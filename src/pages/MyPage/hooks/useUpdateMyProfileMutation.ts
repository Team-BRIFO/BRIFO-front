import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateMyProfile } from '@/api/user'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'
import type { UserProfileFormValues } from '@/types/domain/user'

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UserProfileFormValues) =>
      updateMyProfile({
        nickname: values.nickname,
        companyName: values.companyName,
        stockIds: values.interestStocks.map((stock) => stock.id),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() }),
  })
}
