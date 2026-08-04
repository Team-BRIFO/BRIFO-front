import { getUserHome } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponseGetUserHomeResponse } from '@/api/generated/schemas'
import { useApiQuery } from '@/hooks/api'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'

export function useUserHomeQuery() {
  return useApiQuery({
    queryKey: userQueryKeys.home(),
    operation: getUserHome,
    endpoint: 'getUserHome',
    args: [],
    responseSchema: ApiResponseGetUserHomeResponse,
    response: 'requiredResult',
  })
}
