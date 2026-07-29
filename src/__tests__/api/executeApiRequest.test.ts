import { AxiosError, CanceledError } from 'axios'
import { describe, expect, it } from 'vitest'

import { createAxiosAdapter } from '@/__tests__/api/testAxiosAdapter'
import { ApiError } from '@/api/client/ApiError'
import { executeApiRequest } from '@/api/client/executeApiRequest'
import { requireApiResult } from '@/api/client/result'
import { logout, reissue } from '@/api/generated/endpoints/auth-controller/auth-controller'
import { ApiResponse, ApiResponseReissueResponse } from '@/api/generated/schemas'

describe('executeApiRequest', () => {
  it('returns a generated-schema-validated success wrapper body', async () => {
    const adapter = createAxiosAdapter(() => ({
      data: {
        success: true,
        code: 'COMMON_200',
        message: '요청에 성공했습니다.',
      },
    }))

    const response = await executeApiRequest({
      endpoint: 'logout',
      responseSchema: ApiResponse,
      request: () => logout({ refreshToken: 'refresh-token' }, { adapter }),
    })

    expect(response).toEqual({
      success: true,
      code: 'COMMON_200',
      message: '요청에 성공했습니다.',
    })
  })

  it('keeps an optional result wrapper and lets the boundary require its data', async () => {
    const adapter = createAxiosAdapter(() => ({
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
    }))

    const response = await executeApiRequest({
      endpoint: 'reissue',
      responseSchema: ApiResponseReissueResponse,
      request: () => reissue({ refreshToken: 'refresh-token' }, { adapter }),
    })

    expect(requireApiResult(response, 'reissue').token.accessToken).toBe('new-access')
  })

  it('normalizes a missing required result as a contract ApiError', () => {
    let error: unknown
    try {
      requireApiResult(
        {
          success: true,
          code: 'COMMON_200',
          message: '성공',
        },
        'getUserProfile',
      )
    } catch (cause) {
      error = cause
    }

    expect(error).toMatchObject({
      kind: 'contract',
      code: 'MISSING_API_RESULT',
      endpoint: 'getUserProfile',
      issues: [expect.objectContaining({ input: undefined })],
    })
  })

  it('normalizes invalid success JSON from generated Zod validation', async () => {
    const adapter = createAxiosAdapter(() => ({
      data: {
        success: true,
        code: 'COMMON_200',
      },
    }))

    const promise = executeApiRequest({
      endpoint: 'logout',
      responseSchema: ApiResponse,
      request: () => logout({ refreshToken: 'refresh-token' }, { adapter }),
    })

    await expect(promise).rejects.toMatchObject({
      kind: 'contract',
      code: 'CONTRACT_ERROR',
      endpoint: 'logout',
      issues: expect.any(Array),
    })
  })

  it('preserves service code, status, body, and headers from a normal error response', async () => {
    const body = {
      success: false,
      code: 'AUTH_401_03',
      message: '유효하지 않은 토큰입니다.',
      token: 'must-not-be-retained',
    }
    const adapter = createAxiosAdapter(() => ({
      data: body,
      status: 401,
      headers: {
        Authorization: 'Bearer must-not-be-retained',
        'Set-Cookie': 'refreshToken=must-not-be-retained',
        'X-Request-Id': 'request-1',
      },
    }))

    const promise = executeApiRequest({
      endpoint: 'logout',
      responseSchema: ApiResponse,
      request: () => logout({ refreshToken: 'refresh-token' }, { adapter }),
    })

    const error = await promise.catch((cause: unknown) => cause)

    expect(error).toMatchObject({
      kind: 'http',
      code: 'AUTH_401_03',
      status: 401,
      responseBody: {
        success: false,
        code: 'AUTH_401_03',
        message: '유효하지 않은 토큰입니다.',
      },
      headers: { 'x-request-id': 'request-1' },
    })
    expect((error as ApiError).cause).not.toHaveProperty('config')
    expect((error as ApiError).cause).not.toHaveProperty('response')
  })

  it.each([
    { name: 'non-JSON', body: '<html>Bad Gateway</html>', status: 502 },
    { name: 'schema-different JSON', body: { error: 'unexpected' }, status: 500 },
  ])('uses a safe HTTP fallback for a $name error body', async ({ body, status }) => {
    const adapter = createAxiosAdapter(() => ({ data: body, status }))

    const promise = executeApiRequest({
      endpoint: 'logout',
      responseSchema: ApiResponse,
      request: () => logout({ refreshToken: 'refresh-token' }, { adapter }),
    })

    await expect(promise).rejects.toMatchObject({
      kind: 'http',
      code: `HTTP_${status}`,
    })
  })

  it('distinguishes a network failure with no response', async () => {
    const adapter = createAxiosAdapter(() => {
      throw new AxiosError('Network Error', AxiosError.ERR_NETWORK)
    })

    const promise = executeApiRequest({
      endpoint: 'logout',
      responseSchema: ApiResponse,
      request: () => logout({ refreshToken: 'refresh-token' }, { adapter }),
    })

    await expect(promise).rejects.toMatchObject({
      kind: 'network',
      code: 'NETWORK_ERROR',
    })
  })

  it('classifies Axios timeout errors with a stable TIMEOUT code', async () => {
    const adapter = createAxiosAdapter(() => {
      throw new AxiosError('timeout', 'ETIMEDOUT')
    })

    const promise = executeApiRequest({
      endpoint: 'logout',
      responseSchema: ApiResponse,
      request: () => logout({ refreshToken: 'refresh-token' }, { adapter, timeout: 5 }),
    })

    await expect(promise).rejects.toMatchObject({
      kind: 'network',
      code: 'TIMEOUT',
    })
  })

  it('forwards and classifies a caller AbortSignal', async () => {
    const controller = new AbortController()
    let receivedSignal: AbortSignal | undefined
    const adapter = createAxiosAdapter(
      (config) =>
        new Promise((_resolve, reject) => {
          receivedSignal = config.signal as AbortSignal
          receivedSignal.addEventListener(
            'abort',
            () => reject(new CanceledError('Request canceled', config)),
            { once: true },
          )
        }),
    )

    const promise = executeApiRequest({
      endpoint: 'logout',
      responseSchema: ApiResponse,
      signal: controller.signal,
      request: () =>
        logout(
          { refreshToken: 'refresh-token' },
          {
            adapter,
            signal: controller.signal,
          },
        ),
    })
    await expect.poll(() => receivedSignal).toBe(controller.signal)
    controller.abort()

    await expect(promise).rejects.toMatchObject({
      kind: 'aborted',
      code: 'ABORTED',
    })
    expect(receivedSignal).toBe(controller.signal)
    expect(receivedSignal?.aborted).toBe(true)
  })

  it('returns actual Error instances', () => {
    const error = new ApiError({
      kind: 'network',
      endpoint: 'getAgents',
      code: 'NETWORK_ERROR',
      message: '네트워크 오류',
    })

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ApiError')
  })
})
