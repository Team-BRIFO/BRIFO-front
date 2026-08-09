export const PROFILE_STORAGE_KEY = 'brifo-profile'

export function clearStoredProfile() {
  if (typeof localStorage === 'undefined') return

  localStorage.removeItem(PROFILE_STORAGE_KEY)
}
