import {
  type InfiniteData,
  type QueryFunctionContext,
  type QueryKey,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import type { ZodType } from 'zod'

import { ApiError } from '@/api/client/ApiError'
import { executeApiRequest } from '@/api/client/executeApiRequest'
import { type ApiSuccessWrapper, requireApiResult } from '@/api/client/result'

export type ApiResponseMode = 'body' | 'requiredResult'

export type GeneratedApiOperation = (...arguments_: never[]) => Promise<unknown>

export type GeneratedApiArguments<TOperation extends GeneratedApiOperation> =
  Parameters<TOperation> extends [...infer TArguments, (AxiosRequestConfig | undefined)?]
    ? TArguments
    : Parameters<TOperation>

export type GeneratedApiResponse<TOperation extends GeneratedApiOperation> = Awaited<
  ReturnType<TOperation>
>

type RequiredApiResult<TResponse> =
  TResponse extends ApiSuccessWrapper<infer TResult> ? NonNullable<TResult> : never

type ApiOperationValue<TResponse, TMode extends ApiResponseMode> = TMode extends 'requiredResult'
  ? RequiredApiResult<TResponse>
  : TResponse

type ApiRequestConfig = Omit<AxiosRequestConfig, 'signal'>

interface ApiOperationOptions<
  TOperation extends GeneratedApiOperation,
  TMode extends ApiResponseMode,
> {
  operation: TOperation
  args: GeneratedApiArguments<TOperation>
  responseSchema: ZodType<GeneratedApiResponse<TOperation>>
  response?: TMode
  endpoint: string
  requestConfig?: ApiRequestConfig
  timeoutMs?: number
}

interface ExecuteGeneratedApiOperationOptions<
  TOperation extends GeneratedApiOperation,
  TMode extends ApiResponseMode,
  TData,
> extends ApiOperationOptions<TOperation, TMode> {
  signal?: AbortSignal
  map?: (value: ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>) => TData
}

export async function executeGeneratedApiOperation<
  TOperation extends GeneratedApiOperation,
  TMode extends ApiResponseMode = 'body',
  TData = ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>,
>({
  operation,
  args,
  responseSchema,
  response,
  endpoint,
  requestConfig,
  signal,
  timeoutMs,
  map,
}: ExecuteGeneratedApiOperationOptions<TOperation, TMode, TData>): Promise<TData> {
  const body = await executeApiRequest({
    endpoint,
    responseSchema,
    signal,
    request: () => {
      const invoke = operation as unknown as (...arguments_: unknown[]) => Promise<unknown>
      return invoke(...args, {
        ...requestConfig,
        signal,
        timeout: timeoutMs ?? requestConfig?.timeout,
      })
    },
  })

  const value =
    response === 'requiredResult'
      ? requireApiResult(body as ApiSuccessWrapper<unknown>, endpoint)
      : body

  if (!map) return value as TData

  try {
    return map(value as ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>)
  } catch (cause) {
    if (cause instanceof ApiError) throw cause

    throw new ApiError({
      kind: 'contract',
      endpoint,
      code: 'MAPPING_ERROR',
      message: '서버 응답을 앱 데이터로 변환하지 못했습니다.',
      cause,
    })
  }
}

export interface UseApiQueryOptions<
  TOperation extends GeneratedApiOperation,
  TMode extends ApiResponseMode = 'body',
  TData = ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>,
  TQueryKey extends QueryKey = QueryKey,
>
  extends
    Omit<UseQueryOptions<TData, ApiError, TData, TQueryKey>, 'queryFn' | 'queryKey' | 'select'>,
    ApiOperationOptions<TOperation, TMode> {
  queryKey: TQueryKey
  map?: (value: ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>) => TData
}

export function useApiQuery<
  TOperation extends GeneratedApiOperation,
  TMode extends ApiResponseMode = 'body',
  TData = ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  operation,
  args,
  responseSchema,
  response,
  endpoint,
  requestConfig,
  timeoutMs,
  map,
  ...queryOptions
}: UseApiQueryOptions<TOperation, TMode, TData, TQueryKey>): UseQueryResult<TData, ApiError> {
  return useQuery({
    ...queryOptions,
    queryKey,
    queryFn: async ({ signal }) => {
      return executeGeneratedApiOperation({
        operation,
        args,
        responseSchema,
        response,
        endpoint,
        requestConfig,
        timeoutMs,
        signal,
        map,
      })
    },
  })
}

export interface UseApiInfiniteQueryOptions<
  TOperation extends GeneratedApiOperation,
  TPageParam,
  TMode extends ApiResponseMode = 'body',
  TPageData = ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>,
  TQueryKey extends QueryKey = QueryKey,
>
  extends
    Omit<
      UseInfiniteQueryOptions<
        TPageData,
        ApiError,
        InfiniteData<TPageData, TPageParam>,
        TQueryKey,
        TPageParam
      >,
      'queryFn' | 'queryKey' | 'select'
    >,
    Omit<ApiOperationOptions<TOperation, TMode>, 'args'> {
  queryKey: TQueryKey
  getArgs: (
    context: QueryFunctionContext<TQueryKey, TPageParam>,
  ) => GeneratedApiArguments<TOperation>
  map?: (value: ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>) => TPageData
}

export function useApiInfiniteQuery<
  TOperation extends GeneratedApiOperation,
  TPageParam,
  TMode extends ApiResponseMode = 'body',
  TPageData = ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  operation,
  getArgs,
  responseSchema,
  response,
  endpoint,
  requestConfig,
  timeoutMs,
  map,
  ...queryOptions
}: UseApiInfiniteQueryOptions<
  TOperation,
  TPageParam,
  TMode,
  TPageData,
  TQueryKey
>): UseInfiniteQueryResult<InfiniteData<TPageData, TPageParam>, ApiError> {
  return useInfiniteQuery({
    ...queryOptions,
    queryKey,
    queryFn: async (context) => {
      return executeGeneratedApiOperation({
        operation,
        args: getArgs(context),
        responseSchema,
        response,
        endpoint,
        requestConfig,
        timeoutMs,
        signal: context.signal,
        map,
      })
    },
  })
}

export interface UseApiMutationOptions<
  TOperation extends GeneratedApiOperation,
  TVariables = void,
  TMode extends ApiResponseMode = 'body',
  TData = ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>,
  TOnMutateResult = unknown,
>
  extends
    Omit<UseMutationOptions<TData, ApiError, TVariables, TOnMutateResult>, 'mutationFn'>,
    Omit<ApiOperationOptions<TOperation, TMode>, 'args'> {
  getArgs: (variables: TVariables) => GeneratedApiArguments<TOperation>
  map?: (value: ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>) => TData
}

export function useApiMutation<
  TOperation extends GeneratedApiOperation,
  TVariables = void,
  TMode extends ApiResponseMode = 'body',
  TData = ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>,
  TOnMutateResult = unknown,
>({
  operation,
  getArgs,
  responseSchema,
  response,
  endpoint,
  requestConfig,
  timeoutMs,
  map,
  ...mutationOptions
}: UseApiMutationOptions<TOperation, TVariables, TMode, TData, TOnMutateResult>): UseMutationResult<
  TData,
  ApiError,
  TVariables,
  TOnMutateResult
> {
  return useMutation({
    ...mutationOptions,
    mutationFn: async (variables) => {
      return executeGeneratedApiOperation({
        operation,
        args: getArgs(variables),
        responseSchema,
        response,
        endpoint,
        requestConfig,
        timeoutMs,
        map,
      })
    },
  })
}
