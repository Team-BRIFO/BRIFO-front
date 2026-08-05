import { useQueryClient } from '@tanstack/react-query'

import { updateUserProfile } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponse, type UpdateUserProfileRequest } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'
import type { UserProfileFormValues } from '@/types/domain/user'

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: updateUserProfile,
    endpoint: 'updateUserProfile',
    responseSchema: ApiResponse,
    getArgs: (values: UserProfileFormValues): [UpdateUserProfileRequest] => [
      {
        nickname: values.nickname,
        companyName: values.companyName,
        stockIds: values.interestStocks.map((stock) => stock.id),
      },
    ],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() }),
  })
}
