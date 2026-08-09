import { signupSession } from '@/api/client/signupSession'
import { browserTokenStore } from '@/api/client/tokenStore'
import { clearStoredProfile } from '@/stores/profileStorage'

export function clearClientSession() {
  browserTokenStore.clear()
  signupSession.clear()
  clearStoredProfile()
}
