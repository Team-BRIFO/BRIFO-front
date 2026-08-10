import type { QueryClient } from '@tanstack/react-query'

import { SIGNUP_CSRF_QUERY_KEY } from '@/api/client/signupAuth'
import { signupSession } from '@/api/client/signupSession'
import { browserTokenStore } from '@/api/client/tokenStore'
import { clearStoredProfile } from '@/stores/profileStorage'

export function clearClientSession(queryClient?: QueryClient) {
  browserTokenStore.clear()
  signupSession.clear()
  clearStoredProfile()
  queryClient?.removeQueries({ queryKey: SIGNUP_CSRF_QUERY_KEY })
}
