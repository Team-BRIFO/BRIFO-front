import axios, {
  type AxiosAdapter,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  CanceledError,
  type GenericAbortSignal,
  type InternalAxiosRequestConfig,
  type RawAxiosHeaders,
} from 'axios'

import { serializeQueryParameters } from '@/api/client/paramsSerializer'
import { requireApiResult } from '@/api/client/result'
import { getApiBaseUrl } from '@/api/client/runtimeConfig'
import { signupSession } from '@/api/client/signupSession'
import { browserTokenStore, type TokenStore } from '@/api/client/tokenStore'
import { ApiResponseReissueResponse as ApiResponseReissueResponseSchema } from '@/api/generated/schemas'
import { clearStoredProfile } from '@/stores/profileStorage'

const DEFAULT_TIMEOUT_MS = 15_000
const PUBLIC_AUTH_PATHS = new Set([
  '/api/auth/login/kakao',
  '/api/auth/login/naver',
  '/api/auth/reissue',
  '/api/auth/signup/csrf',
])
const REISSUE_EXCLUDED_PATHS = new Set(['/api/auth/logout'])
const REISSUE_PATH = '/api/auth/reissue'
const SIGNUP_AUTH_PATH_PREFIXES = [
  '/api/policies',
  '/api/onboarding/',
  '/api/users/me/policies',
] as const
const SIGNUP_MUTATION_PATH_PREFIXES = ['/api/users/me/policies', '/api/onboarding/'] as const

type RetriableAxiosConfig = InternalAxiosRequestConfig & {
  _retryAfterRefresh?: boolean
  _authorizationFromTokenStore?: boolean
}

interface CreateBrifoAxiosInstanceOptions {
  baseURL?: string
  adapter?: AxiosAdapter
  tokenStore?: TokenStore
  onSessionExpired?: () => void
}

function getPathname(config: AxiosRequestConfig) {
  const url = config.url ?? ''
  if (url.startsWith('/')) return url.split('?')[0] ?? url

  const baseURL = config.baseURL ?? getApiBaseUrl()
  if (!baseURL) return url.split('?')[0] ?? url

  return new URL(url, baseURL).pathname
}

function isPublicAuthRequest(config: AxiosRequestConfig) {
  return PUBLIC_AUTH_PATHS.has(getPathname(config))
}

function isReissueExcludedRequest(config: AxiosRequestConfig) {
  return REISSUE_EXCLUDED_PATHS.has(getPathname(config))
}

function isSignupAuthRequest(config: AxiosRequestConfig) {
  if (!signupSession.isActive()) return false

  const pathname = getPathname(config)
  return SIGNUP_AUTH_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isSignupMutationRequest(config: AxiosRequestConfig) {
  const method = config.method?.toUpperCase()
  if (!method || method === 'GET' || method === 'HEAD') return false
  if (!signupSession.isActive()) return false

  const pathname = getPathname(config)
  return SIGNUP_MUTATION_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function defaultSessionExpiredHandler() {
  if (typeof window !== 'undefined') window.location.assign('/splash')
}

function createBaseAxiosInstance(baseURL: string, adapter: AxiosAdapter | undefined) {
  return axios.create({
    baseURL,
    adapter,
    timeout: DEFAULT_TIMEOUT_MS,
    withCredentials: true,
    paramsSerializer: {
      serialize: serializeQueryParameters,
    },
    transitional: {
      clarifyTimeoutError: true,
    },
  })
}

function waitForRefresh(refresh: Promise<boolean>, signal: GenericAbortSignal | undefined) {
  if (!signal) return refresh
  if (signal.aborted) return Promise.reject(new CanceledError('Request canceled'))

  return new Promise<boolean>((resolve, reject) => {
    const cleanup = () => signal.removeEventListener?.('abort', handleAbort)
    const handleAbort = () => {
      cleanup()
      reject(new CanceledError('Request canceled'))
    }

    signal.addEventListener?.('abort', handleAbort, { once: true })
    refresh.then(
      (refreshed) => {
        cleanup()
        resolve(refreshed)
      },
      (error: unknown) => {
        cleanup()
        reject(error)
      },
    )
  })
}

export function createBrifoAxiosInstance({
  baseURL = getApiBaseUrl(),
  adapter,
  tokenStore = browserTokenStore,
  onSessionExpired = defaultSessionExpiredHandler,
}: CreateBrifoAxiosInstanceOptions = {}): AxiosInstance {
  const client = createBaseAxiosInstance(baseURL, adapter)
  const refreshClient = createBaseAxiosInstance(baseURL, adapter)
  let refreshPromise: Promise<boolean> | undefined
  let sessionExpirationHandled = false

  function expireSessionOnce() {
    if (sessionExpirationHandled) return

    sessionExpirationHandled = true
    tokenStore.clear()
    clearStoredProfile()
    onSessionExpired()
  }

  function expireSignupSession() {
    signupSession.clear()
    onSessionExpired()
  }

  async function refreshSession() {
    const refreshToken = tokenStore.getRefreshToken()
    if (!refreshToken) return false

    const response = await refreshClient.post(
      REISSUE_PATH,
      { refreshToken },
      {
        validateStatus: () => true,
      },
    )

    if (response.status < 200 || response.status >= 300) return false

    const parsedResponse = ApiResponseReissueResponseSchema.parse(response.data)
    const result = requireApiResult(parsedResponse, 'reissue')
    tokenStore.setTokens(result.token)
    return true
  }

  function getRefreshPromise() {
    if (!refreshPromise) {
      refreshPromise = refreshSession()
        .then((refreshed) => {
          if (!refreshed) expireSessionOnce()
          return refreshed
        })
        .catch((error: unknown) => {
          expireSessionOnce()
          throw error
        })
        .finally(() => {
          refreshPromise = undefined
        })
    }

    return refreshPromise
  }

  client.interceptors.request.use((config) => {
    const authConfig = config as RetriableAxiosConfig

    if (tokenStore.getRefreshToken()) sessionExpirationHandled = false

    if (isPublicAuthRequest(config) || isSignupAuthRequest(config)) {
      config.headers.delete('Authorization')
      authConfig._authorizationFromTokenStore = false
    } else if (!config.headers.has('Authorization') || authConfig._authorizationFromTokenStore) {
      const accessToken = tokenStore.getAccessToken()
      if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`)
        authConfig._authorizationFromTokenStore = true
      }
    }

    const csrfToken = signupSession.getCsrfToken()
    if (csrfToken && isSignupMutationRequest(config)) {
      config.headers.set(signupSession.getCsrfHeaderName(), csrfToken)
    }

    return config
  })

  client.interceptors.response.use(undefined, async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const originalConfig = error.config as RetriableAxiosConfig
    if (
      originalConfig._retryAfterRefresh ||
      isPublicAuthRequest(originalConfig) ||
      isReissueExcludedRequest(originalConfig)
    ) {
      return Promise.reject(error)
    }

    if (isSignupAuthRequest(originalConfig)) {
      expireSignupSession()
      return Promise.reject(error)
    }

    if (!tokenStore.getRefreshToken()) {
      expireSessionOnce()
      return Promise.reject(error)
    }

    originalConfig._retryAfterRefresh = true
    const refreshed = await waitForRefresh(getRefreshPromise(), originalConfig.signal)
    if (!refreshed) return Promise.reject(error)
    if (originalConfig.signal?.aborted) {
      return Promise.reject(new CanceledError('Request canceled'))
    }

    return client.request(originalConfig)
  })

  return client
}

export const AXIOS_INSTANCE = createBrifoAxiosInstance()

export async function axiosInstance<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  const generatedHeaders = AxiosHeaders.from(config.headers as unknown as RawAxiosHeaders)
  const optionHeaders = AxiosHeaders.from(options?.headers as unknown as RawAxiosHeaders)
  const response = await AXIOS_INSTANCE.request<T>({
    ...options,
    ...config,
    headers: AxiosHeaders.concat(generatedHeaders, optionHeaders),
    signal: options?.signal ?? config.signal,
  })

  return response.data
}

export type ErrorType<Error> = Error
export type BodyType<Body> = Body
