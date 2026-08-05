import { getMyPage } from '@/api/generated/endpoints/user-controller/user-controller'
import { ApiResponseGetMyPageResponse } from '@/api/generated/schemas/user-controller'
import { useApiQuery } from '@/hooks/api'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'
import { mapMyUser } from '@/mappers/myMapper'

export function useUserProfileQuery() {
  return useApiQuery({
    queryKey: userQueryKeys.profile(),
    operation: getMyPage,
    endpoint: 'getMyPage',
    args: [],
    responseSchema: ApiResponseGetMyPageResponse,
    response: 'requiredResult',
    map: mapMyUser,
    staleTime: 0,
  })
}
