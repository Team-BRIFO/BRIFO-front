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

/**
 * 성공 응답을 어떤 형태로 돌려줄지 정하는 옵션이다.
 * - `body`: 서버 성공 wrapper를 통째로 넘긴다 (`success` / `code` / `message` / `result?`)
 * - `requiredResult`: wrapper에서 `result`만 꺼내 넘긴다 (없으면 contract 오류)
 */
export type ApiResponseMode = 'body' | 'requiredResult'

/** Orval `axios-functions`가 생성한 요청 함수의 시그니처 */
export type GeneratedApiOperation = (...arguments_: never[]) => Promise<unknown>

/**
 * generated 함수의 인자에서 맨 뒤 optional `AxiosRequestConfig`를 뺀 tuple이다.
 * `args`·`getArgs`에는 이 형태만 넘기면 된다.
 */
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
  /** `src/api/generated/endpoints/...`에 있는 요청 함수 */
  operation: TOperation
  /** generated 함수에 넘길 인자 tuple(Axios config 제외). Query에서 쓴다 */
  args: GeneratedApiArguments<TOperation>
  /**
   * 해당 operation의 성공 응답 Zod Schema.
   * 예: `getDiaryDetail` → `ApiResponseGetDiaryDetailResponse`
   * (`src/api/generated/schemas/...`)
   */
  responseSchema: ZodType<GeneratedApiResponse<TOperation>>
  /** 기본값은 `'body'`. 응답 데이터가 필요하면 `'requiredResult'`를 쓴다 */
  response?: TMode
  /**
   * OpenAPI operationId. generated 함수 이름을 문자열 그대로 적는다.
   * 예: `'getDiaryDetail'`, `'createDiaryShareImage'`
   * `operation.name`은 minify되면 값이 바뀔 수 있어 쓰지 않는다.
   */
  endpoint: string
  requestConfig?: ApiRequestConfig
  /** 지정하지 않으면 Axios instance의 기본 timeout(15초)을 따른다 */
  timeoutMs?: number
}

interface ExecuteGeneratedApiOperationOptions<
  TOperation extends GeneratedApiOperation,
  TMode extends ApiResponseMode,
  TData,
> extends ApiOperationOptions<TOperation, TMode> {
  signal?: AbortSignal
  /**
   * 응답을 Domain/UI 모델로 변환한다. 여기서 난 예외는 `MAPPING_ERROR` contract `ApiError`로 정규화된다.
   * Mapper는 부수효과 없이 작성한다.
   */
  map?: (value: ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>) => TData
}

/**
 * generated operation을 한 번 실행한 뒤 Zod 검증 → optional `result` 확인 → `map` 변환까지 처리한다.
 * 평소에는 `useApiQuery`·`useApiMutation`을 쓰고, 테스트나 React 밖 경로에서만 직접 호출한다.
 */
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

/**
 * GET 같은 조회 API용 Query hook.
 * `queryFn`을 직접 짜거나 Axios config를 넣을 필요 없이 generated operation만 연결하면 된다.
 *
 * @example Diary 상세
 * ```ts
 * useApiQuery({
 *   queryKey: diaryQueryKeys.detail(diaryId),
 *   operation: getDiaryDetail,
 *   endpoint: 'getDiaryDetail',
 *   args: [diaryId],
 *   responseSchema: ApiResponseGetDiaryDetailResponse,
 *   response: 'requiredResult',
 *   map: mapDiaryDetail,
 * })
 * ```
 */
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
  /** `pageParam` 등을 generated 함수 인자 tuple로 변환한다 */
  getArgs: (
    context: QueryFunctionContext<TQueryKey, TPageParam>,
  ) => GeneratedApiArguments<TOperation>
  map?: (value: ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>) => TPageData
}

/** Cursor 기반 목록 같은 Infinite Query용. `getArgs`에서 pageParam을 request DTO 형태로 맞춘다. */
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
  /** `mutate(variables)`의 variables를 generated 함수 인자 tuple로 변환한다 */
  getArgs: (variables: TVariables) => GeneratedApiArguments<TOperation>
  map?: (value: ApiOperationValue<GeneratedApiResponse<TOperation>, TMode>) => TData
}

/**
 * POST·PUT·PATCH·DELETE 같은 Mutation hook. 기본적으로 자동 retry는 하지 않는다.
 *
 * @example Diary 공유 이미지 생성
 * ```ts
 * useApiMutation({
 *   operation: createDiaryShareImage,
 *   endpoint: 'createDiaryShareImage',
 *   responseSchema: ApiResponseCreateDiaryShareImageResponse,
 *   response: 'requiredResult',
 *   getArgs: (diaryId: string) => [diaryId],
 *   map: mapDiaryShareImage,
 * })
 * ```
 */
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
