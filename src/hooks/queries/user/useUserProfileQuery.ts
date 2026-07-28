import { useQuery } from '@tanstack/react-query'

import { getMyUser } from '@/api/user'
import { mapMyUser } from '@/mappers/myMapper'
import { MOCK_USER_PROFILE_META } from '@/mocks/user'

import { userQueryKeys } from './userQueryKeys'

export function useUserProfileQuery() {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: async () => mapMyUser(await getMyUser(), MOCK_USER_PROFILE_META),
  })
}
