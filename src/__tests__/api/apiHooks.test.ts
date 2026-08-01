import { CanceledError } from 'axios'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { createAxiosAdapter } from '@/__tests__/api/testAxiosAdapter'
import { ApiError } from '@/api/client/ApiError'
import { getAgents } from '@/api/generated/endpoints/agent-controller/agent-controller'
import { logout } from '@/api/generated/endpoints/auth-controller/auth-controller'
import { ApiResponse, ApiResponseGetAgentsResponse } from '@/api/generated/schemas'
import { executeGeneratedApiOperation, useApiMutation, useApiQuery } from '@/hooks/api'

function useAgentListHookTypeExample() {
  return useApiQuery({
    queryKey: ['agents', 'list'] as const,
    operation: getAgents,
    endpoint: 'getAgents',
    args: [],
    responseSchema: ApiResponseGetAgentsResponse,
    response: 'requiredResult',
    map: (result) => result.items.map((item) => item.agentId),
  })
}

function useLogoutHookTypeExample() {
  return useApiMutation({
    operation: logout,
    endpoint: 'logout',
    responseSchema: ApiResponse,
    getArgs: (refreshToken: string): [{ refreshToken: string }] => [{ refreshToken }],
  })
}

describe('common API hooks boundary', () => {
  it('infers generated Query and Mutation arguments without Axios config parameters', () => {
    expectTypeOf(useAgentListHookTypeExample).returns.toHaveProperty('data')
    expectTypeOf(useLogoutHookTypeExample).returns.toHaveProperty('mutate')
  })

  it('passes Axios config internally without exposing it in generated operation arguments', async () => {
    const adapter = createAxiosAdapter(() => ({
      data: {
        success: true,
        code: 'COMMON_200',
        message: '성공',
      },
    }))

    const response = await executeGeneratedApiOperation({
      operation: logout,
      endpoint: 'logout',
      args: [{ refreshToken: 'refresh-token' }],
      responseSchema: ApiResponse,
      requestConfig: { adapter },
    })

    expect(response).toEqual({
      success: true,
      code: 'COMMON_200',
      message: '성공',
    })
    expect(adapter).toHaveBeenCalledOnce()
  })

  it('unwraps a required result after generated Zod validation', async () => {
    const adapter = createAxiosAdapter(() => ({
      data: {
        success: true,
        code: 'COMMON_200',
        message: '성공',
        result: {
          items: [],
        },
      },
    }))

    const result = await executeGeneratedApiOperation({
      operation: getAgents,
      endpoint: 'getAgents',
      args: [],
      responseSchema: ApiResponseGetAgentsResponse,
      response: 'requiredResult',
      requestConfig: { adapter },
    })

    expect(result).toEqual({ items: [] })
  })

  it('uses the operationId as the error endpoint and rejects a missing required result', async () => {
    const adapter = createAxiosAdapter(() => ({
      data: {
        success: true,
        code: 'COMMON_200',
        message: '성공',
      },
    }))

    const promise = executeGeneratedApiOperation({
      operation: getAgents,
      endpoint: 'getAgents',
      args: [],
      responseSchema: ApiResponseGetAgentsResponse,
      response: 'requiredResult',
      requestConfig: { adapter },
    })

    await expect(promise).rejects.toMatchObject({
      kind: 'contract',
      code: 'MISSING_API_RESULT',
      endpoint: 'getAgents',
    })
  })

  it('forwards an AbortSignal through the common operation boundary', async () => {
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

    const promise = executeGeneratedApiOperation({
      operation: getAgents,
      endpoint: 'getAgents',
      args: [],
      responseSchema: ApiResponseGetAgentsResponse,
      signal: controller.signal,
      requestConfig: { adapter },
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

  it('normalizes mapper exceptions as contract ApiErrors', async () => {
    const adapter = createAxiosAdapter(() => ({
      data: {
        success: true,
        code: 'COMMON_200',
        message: '성공',
        result: {
          items: [],
        },
      },
    }))

    const promise = executeGeneratedApiOperation({
      operation: getAgents,
      endpoint: 'getAgents',
      args: [],
      responseSchema: ApiResponseGetAgentsResponse,
      response: 'requiredResult',
      requestConfig: { adapter },
      map: () => {
        throw new Error('mapper failed')
      },
    })

    await expect(promise).rejects.toMatchObject({
      kind: 'contract',
      code: 'MAPPING_ERROR',
      endpoint: 'getAgents',
    })
  })

  it('preserves an ApiError intentionally thrown by a mapper', async () => {
    const adapter = createAxiosAdapter(() => ({
      data: {
        success: true,
        code: 'COMMON_200',
        message: '성공',
        result: {
          items: [],
        },
      },
    }))
    const mapperError = new ApiError({
      kind: 'contract',
      endpoint: 'getAgents',
      code: 'INVALID_DOMAIN_VALUE',
      message: '도메인 값이 올바르지 않습니다.',
    })

    const promise = executeGeneratedApiOperation({
      operation: getAgents,
      endpoint: 'getAgents',
      args: [],
      responseSchema: ApiResponseGetAgentsResponse,
      response: 'requiredResult',
      requestConfig: { adapter },
      map: () => {
        throw mapperError
      },
    })

    await expect(promise).rejects.toBe(mapperError)
  })
})
