import { describe, expect, it } from 'vitest'

import { ApiResponseOAuthLoginResponse } from '@/api/generated/schemas/auth-controller'

describe('ApiResponseOAuthLoginResponse', () => {
  it.each([
    {
      name: 'LOGIN with user only (cookie auth)',
      data: {
        success: true,
        code: 'COMMON_200',
        message: 'ok',
        result: {
          loginType: 'LOGIN',
          user: { userId: '019fd537-93a1-7bbb-8850-af72451ba9ad', nickname: 'test' },
        },
      },
    },
    {
      name: 'LOGIN with token',
      data: {
        success: true,
        code: 'COMMON_200',
        message: 'ok',
        result: {
          loginType: 'LOGIN',
          user: { userId: '019fd537-93a1-7bbb-8850-af72451ba9ad', nickname: 'test' },
          token: {
            accessToken: 'access',
            refreshToken: 'refresh',
            accessTokenExpiresIn: 100,
            refreshTokenExpiresIn: 200,
          },
        },
      },
    },
    {
      name: 'SIGNUP_REQUIRED',
      data: {
        success: true,
        code: 'COMMON_200',
        message: 'ok',
        result: { loginType: 'SIGNUP_REQUIRED' },
      },
    },
    {
      name: 'success without result',
      data: { success: true, code: 'COMMON_200', message: 'ok' },
    },
  ])('parses $name', ({ data }) => {
    expect(() => ApiResponseOAuthLoginResponse.parse(data)).not.toThrow()
  })
})
