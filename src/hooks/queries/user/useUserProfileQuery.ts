import { useQuery } from '@tanstack/react-query'

import { getMyUser } from '@/api/user'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'
import { mapMyUser } from '@/mappers/myMapper'
import { MOCK_USER_PROFILE_META } from '@/mocks/user'

export function useUserProfileQuery() {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    staleTime: 0,
    queryFn: async () => mapMyUser(await getMyUser(), MOCK_USER_PROFILE_META),
  })
}
