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
import { browserTokenStore, type TokenStore } from '@/api/client/tokenStore'
import { ApiResponseReissueResponse as ApiResponseReissueResponseSchema } from '@/api/generated/schemas'

const DEFAULT_TIMEOUT_MS = 15_000
const PUBLIC_AUTH_PATHS = new Set([
  '/api/auth/login/kakao',
  '/api/auth/login/naver',
  '/api/auth/reissue',
])
const REISSUE_PATH = '/api/auth/reissue'

type RetriableAxiosConfig = InternalAxiosRequestConfig & {
  _retryAfterRefresh?: boolean
}

interface CreateBrifoAxiosInstanceOptions {
  baseURL?: string
  adapter?: AxiosAdapter
  tokenStore?: TokenStore
  onSessionExpired?: () => void
}

function getPathname(config: AxiosRequestConfig) {
  return new URL(config.url ?? '', config.baseURL ?? getApiBaseUrl()).pathname
}

function isPublicAuthRequest(config: AxiosRequestConfig) {
  return PUBLIC_AUTH_PATHS.has(getPathname(config))
}

function defaultSessionExpiredHandler() {
  if (typeof window !== 'undefined') window.location.assign('/splash')
}

function createBaseAxiosInstance(baseURL: string, adapter: AxiosAdapter | undefined) {
  return axios.create({
    baseURL,
    adapter,
    timeout: DEFAULT_TIMEOUT_MS,
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
    if (tokenStore.getRefreshToken()) sessionExpirationHandled = false

    if (isPublicAuthRequest(config)) {
      config.headers.delete('Authorization')
    } else {
      const accessToken = tokenStore.getAccessToken()
      if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    return config
  })

  client.interceptors.response.use(undefined, async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const originalConfig = error.config as RetriableAxiosConfig
    if (originalConfig._retryAfterRefresh || isPublicAuthRequest(originalConfig)) {
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
