import { AxiosHeaders, isAxiosError, isCancel, type RawAxiosHeaders } from 'axios'
import { ZodError, type ZodIssue } from 'zod'

import { ApiErrorResponse as ApiErrorResponseSchema } from '@/api/generated/schemas'

export type ApiErrorKind = 'http' | 'network' | 'contract' | 'aborted'

const DIAGNOSTIC_RESPONSE_HEADERS = new Set([
  'content-type',
  'retry-after',
  'traceparent',
  'x-correlation-id',
  'x-request-id',
])

function createSafeCause(cause: unknown) {
  if (!(cause instanceof Error)) return undefined

  let message = 'Underlying error'
  if (isAxiosError(cause)) {
    message = cause.code ? `Axios request failed (${cause.code})` : 'Axios request failed'
  } else if (cause instanceof ZodError) {
    message = 'Zod validation failed'
  } else if (cause.name === 'AbortError') {
    message = 'Request aborted'
  }

  const safeCause = new Error(message)
  safeCause.name = cause.name

  const stackFrames = cause.stack?.split('\n').slice(1).join('\n')
  if (stackFrames) safeCause.stack = `${safeCause.name}: ${message}\n${stackFrames}`

  return safeCause
}

interface ApiErrorOptions {
  kind: ApiErrorKind
  endpoint: string
  code: string
  message: string
  status?: number
  serviceMessage?: string
  cause?: unknown
  issues?: ZodIssue[]
  responseBody?: unknown
  headers?: Record<string, string>
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly endpoint: string
  readonly code: string
  readonly status?: number
  readonly serviceMessage?: string
  readonly issues?: ZodIssue[]
  readonly responseBody?: unknown
  readonly headers?: Record<string, string>

  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: createSafeCause(options.cause) })
    this.name = 'ApiError'
    this.kind = options.kind
    this.endpoint = options.endpoint
    this.code = options.code
    this.status = options.status
    this.serviceMessage = options.serviceMessage
    this.issues = options.issues
    this.responseBody = options.responseBody
    this.headers = options.headers
  }
}

interface NormalizeApiErrorOptions {
  endpoint: string
  cause: unknown
  signal?: AbortSignal
}

function getHttpMessage(status: number) {
  if (status === 400) return '요청 내용을 확인해 주세요.'
  if (status === 401) return '로그인이 필요합니다.'
  if (status === 403) return '요청한 작업을 수행할 권한이 없습니다.'
  if (status === 404) return '요청한 정보를 찾을 수 없습니다.'
  if (status === 409) return '현재 상태에서는 요청을 처리할 수 없습니다.'
  if (status >= 500) return '서버에서 요청을 처리하지 못했습니다.'
  return '요청을 처리하지 못했습니다.'
}

function getErrorName(error: unknown) {
  return typeof error === 'object' && error !== null && 'name' in error
    ? String(error.name)
    : undefined
}

function isTimeoutError(error: unknown, signal?: AbortSignal) {
  if (getErrorName(error) === 'TimeoutError' || getErrorName(signal?.reason) === 'TimeoutError') {
    return true
  }

  return isAxiosError(error) && (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED')
}

function isAbortError(error: unknown, signal?: AbortSignal) {
  return (
    getErrorName(error) === 'AbortError' ||
    isCancel(error) ||
    (isAxiosError(error) && error.code === 'ERR_CANCELED') ||
    (signal?.aborted && !isTimeoutError(error, signal))
  )
}

function responseHeaders(rawHeaders: unknown) {
  const headers: Record<string, string> = {}
  const normalizedHeaders =
    rawHeaders instanceof AxiosHeaders
      ? rawHeaders.toJSON()
      : AxiosHeaders.from(rawHeaders as RawAxiosHeaders).toJSON()

  Object.entries(normalizedHeaders).forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase()
    if (DIAGNOSTIC_RESPONSE_HEADERS.has(normalizedKey) && value !== null && value !== undefined) {
      headers[normalizedKey] = Array.isArray(value) ? value.join(', ') : String(value)
    }
  })

  return headers
}

export function normalizeApiError({ endpoint, cause, signal }: NormalizeApiErrorOptions): ApiError {
  if (cause instanceof ApiError) return cause

  if (isAxiosError(cause) && cause.response) {
    const responseBody: unknown = cause.response.data
    const parsedBody = ApiErrorResponseSchema.safeParse(responseBody)
    const status = cause.response.status

    return new ApiError({
      kind: 'http',
      endpoint,
      status,
      code: parsedBody.success ? parsedBody.data.code : `HTTP_${status}`,
      message: getHttpMessage(status),
      serviceMessage: parsedBody.success ? parsedBody.data.message : undefined,
      cause,
      responseBody: parsedBody.success ? parsedBody.data : undefined,
      headers: responseHeaders(cause.response.headers),
    })
  }

  if (cause instanceof ZodError) {
    return new ApiError({
      kind: 'contract',
      endpoint,
      code: 'CONTRACT_ERROR',
      message: '서버 응답 형식이 올바르지 않습니다.',
      cause,
      issues: cause.issues,
    })
  }

  if (isTimeoutError(cause, signal)) {
    return new ApiError({
      kind: 'network',
      endpoint,
      code: 'TIMEOUT',
      message: '요청 시간이 초과되었습니다.',
      cause,
    })
  }

  if (isAbortError(cause, signal)) {
    return new ApiError({
      kind: 'aborted',
      endpoint,
      code: 'ABORTED',
      message: '요청이 취소되었습니다.',
      cause,
    })
  }

  return new ApiError({
    kind: 'network',
    endpoint,
    code: 'NETWORK_ERROR',
    message: '네트워크 연결을 확인해 주세요.',
    cause,
  })
}
