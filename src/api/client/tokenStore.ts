import type { TokenInfo } from '@/api/generated/schemas'

export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'
export const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken'
export const SIGNUP_TOKEN_STORAGE_KEY = 'signupToken'

export interface TokenStore {
  getAccessToken(): string | null
  getRefreshToken(): string | null
  setTokens(tokens: TokenInfo): void
  clear(): void
}

function getLocalStorage() {
  return typeof localStorage === 'undefined' ? undefined : localStorage
}

function getSessionStorage() {
  return typeof sessionStorage === 'undefined' ? undefined : sessionStorage
}

export const browserTokenStore: TokenStore = {
  getAccessToken: () => getLocalStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? null,
  getRefreshToken: () => getLocalStorage()?.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? null,
  setTokens: (tokens) => {
    const storage = getLocalStorage()
    storage?.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken)
    storage?.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
  },
  clear: () => {
    const storage = getLocalStorage()
    storage?.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    storage?.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  },
}

export const signupTokenStore = {
  get: () => getSessionStorage()?.getItem(SIGNUP_TOKEN_STORAGE_KEY) ?? null,
  set: (token: string) => getSessionStorage()?.setItem(SIGNUP_TOKEN_STORAGE_KEY, token),
  clear: () => getSessionStorage()?.removeItem(SIGNUP_TOKEN_STORAGE_KEY),
}
