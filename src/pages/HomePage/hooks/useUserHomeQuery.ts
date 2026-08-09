import { UserHomeResponseSchema } from '@/api/contracts/home'
import { getUserHome } from '@/api/generated/endpoints/user-controller/user-controller'
import { useApiQuery } from '@/hooks/api'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'

export function useUserHomeQuery() {
  return useApiQuery({
    queryKey: userQueryKeys.home(),
    operation: getUserHome,
    endpoint: 'getUserHome',
    args: [],
    responseSchema: UserHomeResponseSchema,
    response: 'requiredResult',
  })
}
