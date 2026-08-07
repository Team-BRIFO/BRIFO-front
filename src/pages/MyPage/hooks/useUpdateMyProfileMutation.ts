import { useQueryClient } from '@tanstack/react-query'

import { updateUserProfile } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponse, type UpdateUserProfileRequest } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'
import type { UserProfileFormValues } from '@/types/domain/user'
import { normalizeProfileText } from '@/utils/profileValidation'

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: updateUserProfile,
    endpoint: 'updateUserProfile',
    responseSchema: ApiResponse,
    getArgs: (values: UserProfileFormValues): [UpdateUserProfileRequest] => [
      {
        nickname: normalizeProfileText(values.nickname),
        companyName: normalizeProfileText(values.companyName),
        stockIds: values.interestStocks.map((stock) => stock.id),
      },
    ],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() }),
  })
}
