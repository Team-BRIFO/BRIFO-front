import { ApiError } from '@/api/client/ApiError'

export interface ApiSuccessWrapper<T> {
  success: boolean
  code: string
  message: string
  result?: T
}

export function requireApiResult<T>(
  response: ApiSuccessWrapper<T>,
  endpoint: string,
): NonNullable<T> {
  if (response.result === undefined || response.result === null) {
    throw new ApiError({
      kind: 'contract',
      endpoint,
      code: 'MISSING_API_RESULT',
      message: '서버 응답에 필요한 데이터가 없습니다.',
      issues: [
        {
          code: 'custom',
          path: ['result'],
          message: 'Required API result is missing',
          input: response.result,
        },
      ],
    })
  }

  return response.result
}
