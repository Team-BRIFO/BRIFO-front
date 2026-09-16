import type { GenericAbortSignal } from 'axios'

import { AXIOS_INSTANCE } from '@/api/client/axiosInstance'
import { signupSession } from '@/api/client/signupSession'

export const SIGNUP_CSRF_QUERY_KEY = ['auth', 'signup', 'csrf'] as const
export const SIGNUP_SESSION_EXPIRED_MESSAGE = 'Signup session expired'

function readSignupCsrfToken(headers: Record<string, unknown>) {
  const value = headers['x-signup-csrf-token'] ?? headers['X-Signup-CSRF-Token']
  return typeof value === 'string' ? value : null
}

export async function ensureSignupCsrfToken(options?: { signal?: GenericAbortSignal }) {
  const response = await AXIOS_INSTANCE.get('/api/auth/signup/csrf', {
    validateStatus: () => true,
    signal: options?.signal,
  })

  if (response.status === 401) {
    throw new Error(SIGNUP_SESSION_EXPIRED_MESSAGE)
  }

  if (response.status < 200 || response.status >= 300) {
    throw new Error('Failed to refresh signup CSRF token')
  }

  const csrfToken = readSignupCsrfToken(response.headers as Record<string, unknown>)
  if (!csrfToken) {
    throw new Error('Missing signup CSRF token')
  }

  signupSession.setCsrfToken(csrfToken)
  return csrfToken
}

/** OAuth 리다이렉트 직전에 호출하므로 기본 타임아웃(15초)만큼 붙잡고 있을 수는 없다. */
const CANCEL_SIGNUP_TIMEOUT_MS = 2_000

/**
 * 로그인을 새로 시작하기 전에 이전 가입 세션(signup_token 쿠키)을 정리한다.
 * best-effort로 호출한다 — 실패해도 새 로그인 시도를 막을 이유가 없다.
 */
export async function cancelSignupSession() {
  try {
    await AXIOS_INSTANCE.post('/api/auth/signup/cancel', null, {
      validateStatus: () => true,
      timeout: CANCEL_SIGNUP_TIMEOUT_MS,
    })
  } catch {
    // 네트워크 실패·타임아웃은 삼킨다. 쿠키는 다음 로그인 응답에서 어차피 갱신된다.
  }
}
