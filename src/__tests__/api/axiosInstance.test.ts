import { describe, expect, it, vi } from 'vitest'

import { createAxiosAdapter } from '@/__tests__/api/testAxiosAdapter'
import { createBrifoAxiosInstance } from '@/api/client/axiosInstance'
import type { TokenStore } from '@/api/client/tokenStore'
import type { TokenInfo } from '@/api/generated/schemas'

const API_BASE_URL = 'https://api.example.com'

function createTokenStore(accessToken: string | null, refreshToken: string | null) {
  let access = accessToken
  let refresh = refreshToken
  const store: TokenStore = {
    getAccessToken: () => access,
    getRefreshToken: () => refresh,
    setTokens: (tokens: TokenInfo) => {
      access = tokens.accessToken
      refresh = tokens.refreshToken
    },
    clear: vi.fn(() => {
      access = null
      refresh = null
    }),
  }

  return store
}

describe('createBrifoAxiosInstance', () => {
  it.each(['/api/auth/login/kakao', '/api/auth/login/naver', '/api/auth/reissue'])(
    'does not attach an Access Token to %s',
    async (pathname) => {
      const tokenStore = createTokenStore('access-token', 'refresh-token')
      const adapter = createAxiosAdapter((config) => {
        expect(config.headers.has('Authorization')).toBe(false)
        return { data: { success: true } }
      })
      const client = createBrifoAxiosInstance({ baseURL: API_BASE_URL, adapter, tokenStore })

      await client.post(pathname, undefined, {
        headers: { Authorization: 'Bearer stale-token' },
      })
    },
  )

  it('attaches the Access Token to protected API requests', async () => {
    const tokenStore = createTokenStore('access-token', 'refresh-token')
    const adapter = createAxiosAdapter((config) => {
      expect(config.headers.get('Authorization')).toBe('Bearer access-token')
      return { data: { success: true } }
    })
    const client = createBrifoAxiosInstance({ baseURL: API_BASE_URL, adapter, tokenStore })

    await client.get('/api/agents')
  })

  it('deduplicates concurrent refresh and retries each original request once', async () => {
    const tokenStore = createTokenStore('expired-access', 'refresh-token')
    let releaseRefresh: (() => void) | undefined
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve
    })
    let refreshCalls = 0
    const protectedCalls = new Map<string, number>()

    const adapter = createAxiosAdapter(async (config) => {
      if (config.url === '/api/auth/reissue') {
        refreshCalls += 1
        await refreshGate
        return {
          data: {
            success: true,
            code: 'COMMON_200',
            message: '재발급했습니다.',
            result: {
              token: {
                accessToken: 'new-access',
                refreshToken: 'new-refresh',
                accessTokenExpiresIn: 100,
                refreshTokenExpiresIn: 200,
              },
            },
          },
        }
      }

      const path = config.url ?? ''
      protectedCalls.set(path, (protectedCalls.get(path) ?? 0) + 1)
      return config.headers.get('Authorization') === 'Bearer new-access'
        ? { data: { success: true } }
        : { data: { success: false }, status: 401 }
    })
    const client = createBrifoAxiosInstance({ baseURL: API_BASE_URL, adapter, tokenStore })
    const requests = Promise.all([client.get('/api/agents'), client.get('/api/badges')])

    await vi.waitFor(() => expect(refreshCalls).toBe(1))
    releaseRefresh?.()

    await expect(requests).resolves.toHaveLength(2)
    expect(refreshCalls).toBe(1)
    expect(protectedCalls.get('/api/agents')).toBe(2)
    expect(protectedCalls.get('/api/badges')).toBe(2)
  })

  it('preserves method, headers, body, credentials, signal, and retries only once', async () => {
    const tokenStore = createTokenStore('expired-access', 'refresh-token')
    const controller = new AbortController()
    const requestBodies: unknown[] = []
    let protectedCalls = 0

    const adapter = createAxiosAdapter((config) => {
      if (config.url === '/api/auth/reissue') {
        return {
          data: {
            success: true,
            code: 'COMMON_200',
            message: '재발급했습니다.',
            result: {
              token: {
                accessToken: 'new-access',
                refreshToken: 'new-refresh',
                accessTokenExpiresIn: 100,
                refreshTokenExpiresIn: 200,
              },
            },
          },
        }
      }

      protectedCalls += 1
      expect(config.method).toBe('post')
      expect(config.headers.get('X-Client')).toBe('brifo')
      expect(config.withCredentials).toBe(true)
      expect(config.signal).toBe(controller.signal)
      requestBodies.push(config.data)
      return protectedCalls === 1
        ? { data: { success: false }, status: 401 }
        : { data: { success: true } }
    })
    const client = createBrifoAxiosInstance({ baseURL: API_BASE_URL, adapter, tokenStore })

    await client.post(
      '/api/protected',
      { value: 1 },
      {
        headers: { 'X-Client': 'brifo' },
        signal: controller.signal,
        withCredentials: true,
      },
    )

    expect(protectedCalls).toBe(2)
    expect(requestBodies).toEqual(['{"value":1}', '{"value":1}'])
  })

  it('clears the session and does not retry when refresh fails', async () => {
    const tokenStore = createTokenStore('expired-access', 'refresh-token')
    const onSessionExpired = vi.fn()
    let protectedCalls = 0
    const adapter = createAxiosAdapter((config) => {
      if (config.url === '/api/auth/reissue') {
        return {
          data: {
            success: false,
            code: 'AUTH_401_04',
            message: 'Refresh Token이 만료되었습니다.',
          },
          status: 401,
        }
      }

      protectedCalls += 1
      return { data: { success: false }, status: 401 }
    })
    const client = createBrifoAxiosInstance({
      baseURL: API_BASE_URL,
      adapter,
      tokenStore,
      onSessionExpired,
    })

    await expect(client.get('/api/agents')).rejects.toMatchObject({
      response: { status: 401 },
    })
    expect(protectedCalls).toBe(1)
    expect(tokenStore.clear).toHaveBeenCalledOnce()
    expect(onSessionExpired).toHaveBeenCalledOnce()
  })

  it('handles concurrent 401 responses without a Refresh Token only once', async () => {
    const tokenStore = createTokenStore('expired-access', null)
    const onSessionExpired = vi.fn()
    const adapter = createAxiosAdapter(() => ({
      data: { success: false },
      status: 401,
    }))
    const client = createBrifoAxiosInstance({
      baseURL: API_BASE_URL,
      adapter,
      tokenStore,
      onSessionExpired,
    })

    const results = await Promise.allSettled([client.get('/api/agents'), client.get('/api/badges')])

    expect(results.every((result) => result.status === 'rejected')).toBe(true)
    expect(tokenStore.clear).toHaveBeenCalledOnce()
    expect(onSessionExpired).toHaveBeenCalledOnce()
  })

  it('does not retry an original request aborted while refresh is pending', async () => {
    const tokenStore = createTokenStore('expired-access', 'refresh-token')
    const controller = new AbortController()
    let releaseRefresh: (() => void) | undefined
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve
    })
    let refreshCalls = 0
    let protectedCalls = 0
    const adapter = createAxiosAdapter(async (config) => {
      if (config.url === '/api/auth/reissue') {
        refreshCalls += 1
        await refreshGate
        return {
          data: {
            success: true,
            code: 'COMMON_200',
            message: '재발급했습니다.',
            result: {
              token: {
                accessToken: 'new-access',
                refreshToken: 'new-refresh',
                accessTokenExpiresIn: 100,
                refreshTokenExpiresIn: 200,
              },
            },
          },
        }
      }

      protectedCalls += 1
      return { data: { success: false }, status: 401 }
    })
    const client = createBrifoAxiosInstance({ baseURL: API_BASE_URL, adapter, tokenStore })
    const promise = client.get('/api/agents', { signal: controller.signal })

    await vi.waitFor(() => expect(refreshCalls).toBe(1))
    controller.abort()
    releaseRefresh?.()

    await expect(promise).rejects.toMatchObject({ code: 'ERR_CANCELED' })
    expect(protectedCalls).toBe(1)
  })
})
